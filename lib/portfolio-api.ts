const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

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
  HasDownload: boolean;
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
  Version: string | null;
  Platform: string | null;
  FileName: string | null;
  DownloadCount: number;
}

export interface PortfolioAdminItem extends Omit<PortfolioDetail, "DownloadCount"> {
  SortOrder: number;
  Published: boolean;
  DownloadCount: number;
}

export interface UpsertPortfolioItemRequest {
  Slug: string;
  Published: boolean;
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
  Version: string | null;
  Platform: string | null;
}

export interface ReorderItem {
  Id: number;
  SortOrder: number;
}

export async function fetchPortfolioList(): Promise<PortfolioListItem[]> {
  const res = await fetch(`${API_URL}/api/portfolio`, { next: { tags: ["portfolio"], revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch portfolio list");
  return res.json();
}

export async function fetchPortfolioDetail(slug: string): Promise<PortfolioDetail | null> {
  const res = await fetch(`${API_URL}/api/portfolio/${slug}`, { next: { tags: ["portfolio"], revalidate: 300 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch portfolio item");
  return res.json();
}

// Best-effort on-demand cache invalidation. Called after admin mutations so
// the public site reflects changes immediately instead of waiting up to the
// 300s fallback revalidate window. Runs client-side (these functions are
// invoked from "use client" admin pages), so it hits our own same-origin
// route handler rather than the external API.
async function triggerRevalidation(): Promise<void> {
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

// PortfolioItem.Image is a relative URL path like "/uploads/images/<guid>.png" served
// by the API, not an absolute URL, so it needs the API's origin prefixed to be loadable.
export function imageUrl(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}${image}`;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchAdminPortfolioList(token: string): Promise<PortfolioAdminItem[]> {
  const res = await fetch(`${API_URL}/api/admin/portfolio`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch admin portfolio list");
  return res.json();
}

export async function fetchAdminPortfolioItem(token: string, id: number): Promise<PortfolioAdminItem> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, { headers: authHeaders(token), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch portfolio item");
  return res.json();
}

export async function createPortfolioItem(token: string, body: UpsertPortfolioItemRequest): Promise<PortfolioAdminItem> {
  const res = await fetch(`${API_URL}/api/admin/portfolio`, { method: "POST", headers: authHeaders(token), body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).error ?? "Failed to create item");
  const result = await res.json();
  await triggerRevalidation();
  return result;
}

export async function updatePortfolioItem(token: string, id: number, body: UpsertPortfolioItemRequest): Promise<PortfolioAdminItem> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update item");
  const result = await res.json();
  await triggerRevalidation();
  return result;
}

export async function deletePortfolioItem(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, { method: "DELETE", headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to delete item");
  await triggerRevalidation();
}

export async function reorderPortfolioItems(token: string, items: ReorderItem[]): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/reorder`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(items) });
  if (!res.ok) throw new Error("Failed to reorder items");
  await triggerRevalidation();
}

async function uploadFile(token: string, id: number, kind: "image" | "file", file: File): Promise<PortfolioAdminItem> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}/${kind}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload ${kind}`);
  const result = await res.json();
  await triggerRevalidation();
  return result;
}

export const uploadPortfolioImage = (token: string, id: number, file: File) => uploadFile(token, id, "image", file);
export const uploadPortfolioFile = (token: string, id: number, file: File) => uploadFile(token, id, "file", file);
