import type { AuthFetchOptions } from "@zhmdff/auth-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

// Matches useAuth().fetch's signature — auto-injects Authorization, retries once
// on 401 via refresh, and (per the package's internals) auto-JSON-stringifies
// plain object bodies while passing FormData through untouched with no
// Content-Type header, so it works for both CRUD and multipart uploads.
export type AuthFetch = <T = unknown>(endpoint: string, options?: AuthFetchOptions) => Promise<T>;

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

// authFetch prepends apiUrl itself, so endpoints below are relative paths.

export async function fetchAdminPortfolioList(authFetch: AuthFetch): Promise<PortfolioAdminItem[]> {
  return authFetch<PortfolioAdminItem[]>("/api/admin/portfolio");
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
