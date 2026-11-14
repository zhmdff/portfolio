"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@zhmdff/auth-react";

interface AdminHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title = "Portfolio Items", actions }: AdminHeaderProps) {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-foreground/10 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-40 mb-1">
            <Link href="/" className="hover:opacity-100 transition-opacity">
              Home
            </Link>
            <span>/</span>
            <span>Admin</span>
            {title && (
              <>
                <span>/</span>
                <span className="opacity-80">{title}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-light tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-sm">
          <nav className="flex items-center gap-1 border border-foreground/10 p-1">
            <Link
              href="/admin/portfolio"
              className={`px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
                pathname === "/admin/portfolio"
                  ? "bg-foreground text-background font-medium"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/admin/messages"
              className={`px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
                pathname.startsWith("/admin/messages")
                  ? "bg-foreground text-background font-medium"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Messages
            </Link>
          </nav>

          {actions}

          <div className="h-4 w-px bg-foreground/10 hidden sm:block" />

          <button
            onClick={() => logout()}
            className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
