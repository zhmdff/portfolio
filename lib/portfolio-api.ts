import type { AuthFetchOptions } from "@zhmdff/auth-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

// Matches useAuth().fetch's signature — auto-injects Authorization, retries once
// on 401 via refresh, and (per the package's internals) auto-JSON-stringifies
// plain object bodies while passing FormData through untouched with no
// Content-Type header, so it works for both CRUD and multipart uploads.
export type AuthFetch = <T = unknown>(endpoint: string, options?: AuthFetchOptions) => Promise<T>;

export interface DownloadLink {
  Name: string;
  Url: string;
}

export interface PortfolioListItem {
  Id: number;
  Slug: string;
  Name: string;
  NameEn: string;
  Subtitle: string | null;
  SubtitleEn: string | null;
  Description: string;
  DescriptionEn: string;
  Tags: string[];
  Image: string | null;
  Url: string | null;
  GithubUrl: string | null;
  HasDownload: boolean;
  PinnedWeb: boolean;
  PinnedSoftware: boolean;
  Kind: "Web" | "Software";
  DownloadLinks: DownloadLink[];
}

export interface PortfolioDetail {
  Id: number;
  Slug: string;
  Name: string;
  NameEn: string;
  Subtitle: string | null;
  SubtitleEn: string | null;
  Description: string;
  DescriptionEn: string;
  TechnicalDetails: string[];
  TechnicalDetailsEn: string[];
  Tags: string[];
  Image: string | null;
  Url: string | null;
  GithubUrl: string | null;
  Version: string | null;
  Platform: string | null;
  FileName: string | null;
  DownloadCount: number;
  Kind: "Web" | "Software";
  DownloadLinks: DownloadLink[];
}

export interface PortfolioAdminItem extends Omit<PortfolioDetail, "DownloadCount"> {
  SortOrder: number;
  Published: boolean;
  PinnedWeb: boolean;
  PinnedSoftware: boolean;
  DownloadCount: number;
}

export interface UpsertPortfolioItemRequest {
  Slug: string;
  Published: boolean;
  PinnedWeb: boolean;
  PinnedSoftware: boolean;
  Name: string;
  NameEn: string;
  Subtitle: string | null;
  SubtitleEn: string | null;
  Description: string;
  DescriptionEn: string;
  TechnicalDetails: string[];
  TechnicalDetailsEn: string[];
  Tags: string[];
  Url: string | null;
  GithubUrl: string | null;
  Version: string | null;
  Platform: string | null;
  Kind: "Web" | "Software";
  DownloadLinks: DownloadLink[];
}

export interface ReorderItem {
  Id: number;
  SortOrder: number;
}

export interface AdminPortfolioListResponse {
  Items: PortfolioAdminItem[];
  PinnedWebCount: number;
  PinnedSoftwareCount: number;
}

// ---------------------------------------------------------------------------
// Public portfolio list (all published, used by /projects page)
// ---------------------------------------------------------------------------

const PORTFOLIO_LIST_TTL_MS = 300_000;

let portfolioListCache: { data: PortfolioListItem[]; expiresAt: number } | null = null;
let portfolioListInflight: Promise<PortfolioListItem[]> | null = null;

export function getCachedPortfolioList(): PortfolioListItem[] | null {
  if (portfolioListCache && portfolioListCache.expiresAt > Date.now()) {
    return portfolioListCache.data;
  }
  return null;
}

export function invalidatePortfolioCache(): void {
  portfolioListCache = null;
  portfolioListInflight = null;
}

export async function fetchPortfolioList(): Promise<PortfolioListItem[]> {
  const cached = getCachedPortfolioList();
  if (cached) return cached;
  if (portfolioListInflight) return portfolioListInflight;

  portfolioListInflight = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolio`, { next: { tags: ["portfolio"], revalidate: 300 } });
      if (!res.ok) throw new Error("Failed to fetch portfolio list");
      const data: PortfolioListItem[] = await res.json();
      portfolioListCache = { data, expiresAt: Date.now() + PORTFOLIO_LIST_TTL_MS };
      return data;
    } finally {
      portfolioListInflight = null;
    }
  })();

  return portfolioListInflight;
}

// ---------------------------------------------------------------------------
// Pinned items for homepage showcases — no long-term cache (small endpoint)
// ---------------------------------------------------------------------------

type PinnedKind = "web" | "software";

const pinnedMem: Partial<Record<PinnedKind, PortfolioListItem[]>> = {};
const pinnedInflight: Partial<Record<PinnedKind, Promise<PortfolioListItem[]>>> = {};

// Instant (stale) data for first paint: memory first, then sessionStorage.
export function getCachedPinnedPortfolioList(kind: PinnedKind): PortfolioListItem[] | null {
  if (pinnedMem[kind]) return pinnedMem[kind]!;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`pinned:${kind}`);
    if (raw) {
      const data = JSON.parse(raw) as PortfolioListItem[];
      pinnedMem[kind] = data;
      return data;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

// Always hits network (deduped); callers show cached data meanwhile.
export function fetchPinnedPortfolioList(kind: PinnedKind): Promise<PortfolioListItem[]> {
  const existing = pinnedInflight[kind];
  if (existing) return existing;
  const p = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolio/pinned?kind=${kind}`, {
        next: { tags: ["portfolio"], revalidate: 300 },
      });
      if (!res.ok) throw new Error(`Failed to fetch pinned portfolio (${kind})`);
      const data: PortfolioListItem[] = await res.json();
      pinnedMem[kind] = data;
      try {
        window.sessionStorage.setItem(`pinned:${kind}`, JSON.stringify(data));
      } catch {
        // ignore storage errors
      }
      return data;
    } finally {
      delete pinnedInflight[kind];
    }
  })();
  pinnedInflight[kind] = p;
  return p;
}

// Kick off both requests as soon as this module loads (before hydration/effects).
if (typeof window !== "undefined") {
  fetchPinnedPortfolioList("web").catch(() => {});
  fetchPinnedPortfolioList("software").catch(() => {});
}

// ---------------------------------------------------------------------------
// Single item detail
// ---------------------------------------------------------------------------

export async function fetchPortfolioDetail(slug: string): Promise<PortfolioDetail | null> {
  const res = await fetch(`${API_URL}/api/portfolio/${slug}`, { next: { tags: ["portfolio"], revalidate: 300 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch portfolio item");
  return res.json();
}

// ---------------------------------------------------------------------------
// Best-effort on-demand cache invalidation (called after admin mutations)
// ---------------------------------------------------------------------------

async function triggerRevalidation(): Promise<void> {
  invalidatePortfolioCache();
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? "" },
    });
  } catch {
    // Best-effort — the 300s fallback window covers a missed call.
  }
}

export function downloadUrl(id: number): string {
  return `${API_URL}/api/portfolio/${id}/download`;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface ContactMessageItem {
  Id: number;
  Email: string;
  Subject: string;
  Message: string;
  IsRead: boolean;
  EmailSent: boolean;
  EmailError: string | null;
  CreatedAt: string;
}

export async function submitContactMessage(input: {
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean; id: number; emailSent: boolean }> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Email: input.email,
      Subject: input.subject,
      Message: input.message,
    }),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to send message");
  }
  return res.json();
}

export async function fetchContactMessages(authFetch: AuthFetch): Promise<ContactMessageItem[]> {
  return authFetch<ContactMessageItem[]>("/api/admin/contact");
}

export async function fetchContactMessage(authFetch: AuthFetch, id: number): Promise<ContactMessageItem> {
  return authFetch<ContactMessageItem>(`/api/admin/contact/${id}`);
}

export async function markContactMessageRead(
  authFetch: AuthFetch,
  id: number,
  isRead: boolean
): Promise<ContactMessageItem> {
  return authFetch<ContactMessageItem>(`/api/admin/contact/${id}/read`, {
    method: "PATCH",
    body: { IsRead: isRead },
  });
}

export async function deleteContactMessage(authFetch: AuthFetch, id: number): Promise<void> {
  await authFetch(`/api/admin/contact/${id}`, { method: "DELETE" });
}

// PortfolioItem.Image is a relative URL path like "/uploads/images/<guid>.png" served
// by the API, not an absolute URL, so it needs the API's origin prefixed to be loadable.
export function imageUrl(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}${image}`;
}

// authFetch prepends apiUrl itself, so endpoints below are relative paths.

export async function fetchAdminPortfolioList(authFetch: AuthFetch): Promise<AdminPortfolioListResponse> {
  return authFetch<AdminPortfolioListResponse>("/api/admin/portfolio");
}

export async function fetchAdminPortfolioItem(authFetch: AuthFetch, id: number): Promise<PortfolioAdminItem> {
  return authFetch<PortfolioAdminItem>(`/api/admin/portfolio/${id}`);
}

export async function createPortfolioItem(authFetch: AuthFetch, body: UpsertPortfolioItemRequest): Promise<PortfolioAdminItem> {
  const result = await authFetch<PortfolioAdminItem>("/api/admin/portfolio", { method: "POST", body });
  await triggerRevalidation();
  return result;
}

export async function updatePortfolioItem(authFetch: AuthFetch, id: number, body: UpsertPortfolioItemRequest): Promise<PortfolioAdminItem> {
  const result = await authFetch<PortfolioAdminItem>(`/api/admin/portfolio/${id}`, { method: "PUT", body });
  await triggerRevalidation();
  return result;
}

export async function pinPortfolioItem(
  authFetch: AuthFetch,
  id: number,
  pinnedWeb: boolean,
  pinnedSoftware: boolean
): Promise<PortfolioAdminItem> {
  const result = await authFetch<PortfolioAdminItem>(`/api/admin/portfolio/${id}/pin`, {
    method: "PATCH",
    body: { PinnedWeb: pinnedWeb, PinnedSoftware: pinnedSoftware },
  });
  await triggerRevalidation();
  return result;
}

export async function deletePortfolioItem(authFetch: AuthFetch, id: number): Promise<void> {
  await authFetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
  await triggerRevalidation();
}

export async function reorderPortfolioItems(authFetch: AuthFetch, items: ReorderItem[]): Promise<void> {
  await authFetch("/api/admin/portfolio/reorder", { method: "PUT", body: items });
  await triggerRevalidation();
}

async function uploadFile(authFetch: AuthFetch, id: number, kind: "image" | "file", file: File): Promise<PortfolioAdminItem> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await authFetch<PortfolioAdminItem>(`/api/admin/portfolio/${id}/${kind}`, { method: "POST", body: formData });
  await triggerRevalidation();
  return result;
}

export const uploadPortfolioImage = (authFetch: AuthFetch, id: number, file: File) => uploadFile(authFetch, id, "image", file);
export const uploadPortfolioFile = (authFetch: AuthFetch, id: number, file: File) => uploadFile(authFetch, id, "file", file);
