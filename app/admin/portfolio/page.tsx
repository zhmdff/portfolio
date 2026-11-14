"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@zhmdff/auth-react";
import {
  fetchAdminPortfolioList,
  deletePortfolioItem,
  reorderPortfolioItems,
  updatePortfolioItem,
  pinPortfolioItem,
  PortfolioAdminItem,
} from "@/lib/portfolio-api";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminPortfolioListPage() {
  const { fetch: authFetch } = useAuth();
  const [items, setItems] = useState<PortfolioAdminItem[]>([]);
  const [pinnedWebCount, setPinnedWebCount] = useState(0);
  const [pinnedSoftwareCount, setPinnedSoftwareCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminPortfolioList(authFetch);
      setItems(res.Items);
      setPinnedWebCount(res.PinnedWebCount);
      setPinnedSoftwareCount(res.PinnedSoftwareCount);
    } catch (e) {
      console.error("Failed to load portfolio items", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this portfolio item? This cannot be undone.")) return;
    await deletePortfolioItem(authFetch, id);
    await load();
  };

  const handleTogglePublished = async (item: PortfolioAdminItem) => {
    await updatePortfolioItem(authFetch, item.Id, {
      Slug: item.Slug,
      Published: !item.Published,
      PinnedWeb: item.PinnedWeb,
      PinnedSoftware: item.PinnedSoftware,
      Name: item.Name,
      NameEn: item.NameEn,
      Subtitle: item.Subtitle,
      SubtitleEn: item.SubtitleEn,
      Description: item.Description,
      DescriptionEn: item.DescriptionEn,
      TechnicalDetails: item.TechnicalDetails,
      TechnicalDetailsEn: item.TechnicalDetailsEn,
      Tags: item.Tags,
      Url: item.Url,
      GithubUrl: item.GithubUrl,
      Version: item.Version,
      Platform: item.Platform,
      Kind: item.Kind,
      DownloadLinks: item.DownloadLinks ?? [],
    });
    await load();
  };

  const handleTogglePin = async (item: PortfolioAdminItem, type: "web" | "software") => {
    const nextWeb = type === "web" ? !item.PinnedWeb : item.PinnedWeb;
    const nextSoft = type === "software" ? !item.PinnedSoftware : item.PinnedSoftware;

    if (type === "web" && nextWeb && pinnedWebCount >= 3) {
      if (!confirm("3 Web items are already pinned. Pinning this will mean more than 3 are pinned (only 3 will show on showcase). Proceed?")) {
        return;
      }
    }
    if (type === "software" && nextSoft && pinnedSoftwareCount >= 3) {
      if (!confirm("3 Software items are already pinned. Pinning this will mean more than 3 are pinned (only 3 will show on showcase). Proceed?")) {
        return;
      }
    }

    await pinPortfolioItem(authFetch, item.Id, nextWeb, nextSoft);
    await load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setItems(reordered);

    await reorderPortfolioItems(
      authFetch,
      reordered.map((item, i) => ({ Id: item.Id, SortOrder: i }))
    );
  };

  if (loading) return <div className="p-8 text-sm opacity-60">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <AdminHeader
        title="Portfolio Items"
        actions={
          <Link href="/admin/portfolio/new" className="btn-geometric px-4 py-2 text-xs uppercase tracking-widest">
            + New Item
          </Link>
        }
      />

      {/* Pin count status & warnings */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="border border-foreground/10 px-3 py-1.5 flex items-center gap-2">
          <span className="opacity-60">Pinned Web:</span>
          <span className={`font-mono font-medium ${pinnedWebCount >= 3 ? "text-amber-500" : ""}`}>
            {pinnedWebCount}/3
          </span>
          {pinnedWebCount >= 3 && <span className="text-amber-500">⚠ Max capacity</span>}
        </div>
        <div className="border border-foreground/10 px-3 py-1.5 flex items-center gap-2">
          <span className="opacity-60">Pinned Software:</span>
          <span className={`font-mono font-medium ${pinnedSoftwareCount >= 3 ? "text-amber-500" : ""}`}>
            {pinnedSoftwareCount}/3
          </span>
          {pinnedSoftwareCount >= 3 && <span className="text-amber-500">⚠ Max capacity</span>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-foreground/10 opacity-60 text-xs uppercase tracking-wider">
              <th className="py-3">Name</th>
              <th>Kind</th>
              <th>Status</th>
              <th>Pin Web</th>
              <th>Pin Soft</th>
              <th>Links</th>
              <th>Downloads</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.Id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                <td className="py-3">
                  <div className="font-medium">{item.NameEn || item.Name}</div>
                  <div className="text-xs opacity-40 font-mono">/{item.Slug}</div>
                </td>
                <td>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-foreground/20">
                    {item.Kind || (item.FileName ? "Software" : "Web")}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleTogglePublished(item)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      item.Published
                        ? "bg-foreground/10 hover:bg-foreground/20"
                        : "opacity-40 hover:opacity-100 line-through"
                    }`}
                  >
                    {item.Published ? "Published" : "Draft"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTogglePin(item, "web")}
                    title={item.PinnedWeb ? "Unpin from Web Showcase" : "Pin to Web Showcase"}
                    className={`text-xs px-2 py-1 border transition-colors ${
                      item.PinnedWeb
                        ? "border-foreground bg-foreground text-background font-medium"
                        : "border-foreground/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {item.PinnedWeb ? "★ Pinned" : "☆ Pin"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleTogglePin(item, "software")}
                    title={item.PinnedSoftware ? "Unpin from Software Showcase" : "Pin to Software Showcase"}
                    className={`text-xs px-2 py-1 border transition-colors ${
                      item.PinnedSoftware
                        ? "border-foreground bg-foreground text-background font-medium"
                        : "border-foreground/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {item.PinnedSoftware ? "★ Pinned" : "☆ Pin"}
                  </button>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {item.Url && (
                      <a
                        href={item.Url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline opacity-60 hover:opacity-100"
                        title={item.Url}
                      >
                        Demo
                      </a>
                    )}
                    {item.GithubUrl && (
                      <a
                        href={item.GithubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline opacity-60 hover:opacity-100 flex items-center gap-1"
                        title={item.GithubUrl}
                      >
                        GitHub
                      </a>
                    )}
                    {!item.Url && !item.GithubUrl && <span className="text-xs opacity-20">—</span>}
                  </div>
                </td>
                <td>
                  <span className="text-xs font-mono opacity-70">
                    {item.DownloadCount}
                    {item.FileName && ` (${item.FileName})`}
                    {item.DownloadLinks && item.DownloadLinks.length > 0 && ` +${item.DownloadLinks.length} urls`}
                  </span>
                </td>
                <td className="flex gap-2 py-3 justify-end items-center">
                  <button onClick={() => move(index, -1)} disabled={index === 0} className="disabled:opacity-20 px-1 hover:opacity-100">
                    ↑
                  </button>
                  <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="disabled:opacity-20 px-1 hover:opacity-100">
                    ↓
                  </button>
                  <Link href={`/admin/portfolio/${item.Id}/edit`} className="text-xs underline opacity-80 hover:opacity-100 ml-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item.Id)} className="text-xs text-red-500 underline ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
