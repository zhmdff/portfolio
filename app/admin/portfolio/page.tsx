"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@zhmdff/auth-react";
import {
  fetchAdminPortfolioList,
  deletePortfolioItem,
  reorderPortfolioItems,
  updatePortfolioItem,
  PortfolioAdminItem,
} from "@/lib/portfolio-api";

export default function AdminPortfolioListPage() {
  const { fetch: authFetch, logout } = useAuth();
  const [items, setItems] = useState<PortfolioAdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const list = await fetchAdminPortfolioList(authFetch);
    setItems(list);
    setLoading(false);
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
      Version: item.Version,
      Platform: item.Platform,
    });
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
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">Portfolio Items</h1>
        <div className="flex gap-4 items-center">
          <Link href="/admin/messages" className="text-sm opacity-60 hover:opacity-100">Messages</Link>
          <Link href="/admin/portfolio/new" className="btn-geometric px-4 py-2 text-sm">New Item</Link>
          <button onClick={() => logout()} className="text-sm opacity-60 hover:opacity-100">Log out</button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-foreground/10 opacity-60">
            <th className="py-2">Name</th>
            <th>Published</th>
            <th>Type</th>
            <th>Downloads</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.Id} className="border-b border-foreground/5">
              <td className="py-3">{item.NameEn}</td>
              <td>
                <button onClick={() => handleTogglePublished(item)} className="underline">
                  {item.Published ? "Published" : "Draft"}
                </button>
              </td>
              <td>{item.FileName ? "App" : "Web"}</td>
              <td>{item.DownloadCount}</td>
              <td className="flex gap-2 py-3 justify-end">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="disabled:opacity-20">↑</button>
                <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="disabled:opacity-20">↓</button>
                <Link href={`/admin/portfolio/${item.Id}/edit`} className="underline">Edit</Link>
                <button onClick={() => handleDelete(item.Id)} className="text-red-500 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
