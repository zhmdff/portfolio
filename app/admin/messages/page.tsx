"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@zhmdff/auth-react";
import {
  deleteContactMessage,
  fetchContactMessages,
  markContactMessageRead,
  ContactMessageItem,
} from "@/lib/portfolio-api";

export default function AdminMessagesPage() {
  const { fetch: authFetch, logout } = useAuth();
  const [items, setItems] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchContactMessages(authFetch);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleRead = async (item: ContactMessageItem) => {
    await markContactMessageRead(authFetch, item.Id, !item.IsRead);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    await deleteContactMessage(authFetch, id);
    await load();
  };

  if (loading) return <div className="p-8 text-sm opacity-60">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">Messages</h1>
        <div className="flex gap-4">
          <Link href="/admin/portfolio" className="text-sm opacity-60 hover:opacity-100">
            Portfolio
          </Link>
          <button onClick={() => logout()} className="text-sm opacity-60 hover:opacity-100">
            Log out
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm opacity-50">No messages yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-foreground/10 opacity-60">
              <th className="py-2">From</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.Id} className={`border-b border-foreground/5 ${item.IsRead ? "opacity-60" : ""}`}>
                <td className="py-3 font-mono text-xs">{item.Email}</td>
                <td>
                  <Link href={`/admin/messages/${item.Id}`} className="underline">
                    {item.Subject}
                  </Link>
                </td>
                <td>
                  <button onClick={() => handleToggleRead(item)} className="underline">
                    {item.IsRead ? "Read" : "Unread"}
                  </button>
                  {!item.EmailSent && <span className="ml-2 text-red-500 text-xs">email failed</span>}
                </td>
                <td className="text-xs opacity-60">{new Date(item.CreatedAt).toLocaleString()}</td>
                <td className="py-3 text-right">
                  <button onClick={() => handleDelete(item.Id)} className="text-red-500 underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
