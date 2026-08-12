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
  const res = await fetch(`${API_URL}/api/portfolio`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch portfolio list");
  return res.json();
}

export async function fetchPortfolioDetail(slug: string): Promise<PortfolioDetail | null> {
  const res = await fetch(`${API_URL}/api/portfolio/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch portfolio item");
  return res.json();
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
  return res.json();
}

export async function updatePortfolioItem(token: string, id: number, body: UpsertPortfolioItemRequest): Promise<PortfolioAdminItem> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update item");
  return res.json();
}

export async function deletePortfolioItem(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, { method: "DELETE", headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to delete item");
}

export async function reorderPortfolioItems(token: string, items: ReorderItem[]): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/portfolio/reorder`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(items) });
  if (!res.ok) throw new Error("Failed to reorder items");
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
  return res.json();
}

export const uploadPortfolioImage = (token: string, id: number, file: File) => uploadFile(token, id, "image", file);
export const uploadPortfolioFile = (token: string, id: number, file: File) => uploadFile(token, id, "file", file);
