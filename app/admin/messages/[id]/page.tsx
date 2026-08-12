"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@zhmdff/auth-react";
import {
  deleteContactMessage,
  fetchContactMessage,
  markContactMessageRead,
  ContactMessageItem,
} from "@/lib/portfolio-api";

export default function AdminMessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetch: authFetch } = useAuth();
  const [item, setItem] = useState<ContactMessageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const message = await fetchContactMessage(authFetch, Number(id));
        setItem(message);
        if (!message.IsRead) {
          const updated = await markContactMessageRead(authFetch, message.Id, true);
          setItem(updated);
        }
      } catch {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm("Delete this message? This cannot be undone.")) return;
    await deleteContactMessage(authFetch, item.Id);
    router.replace("/admin/messages");
  };

  if (loading) return <div className="p-8 text-sm opacity-60">Loading...</div>;
  if (!item) return <div className="p-8 text-sm opacity-60">Message not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <Link href="/admin/messages" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">
        &larr; Messages
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-light">{item.Subject}</h1>
        <p className="text-sm font-mono opacity-70">{item.Email}</p>
        <p className="text-xs opacity-40">{new Date(item.CreatedAt).toLocaleString()}</p>
        {!item.EmailSent && (
          <p className="text-xs text-red-500">
            Email notification failed{item.EmailError ? `: ${item.EmailError}` : ""}
          </p>
        )}
      </div>

      <div className="whitespace-pre-wrap text-sm leading-relaxed border-t border-foreground/10 pt-6">
        {item.Message}
      </div>

      <div className="flex gap-4 pt-4">
        <a href={`mailto:${item.Email}?subject=Re: ${encodeURIComponent(item.Subject)}`} className="btn-geometric px-4 py-2 text-sm">
          Reply
        </a>
        <button onClick={handleDelete} className="text-sm text-red-500 underline">
          Delete
        </button>
      </div>
    </div>
  );
}
