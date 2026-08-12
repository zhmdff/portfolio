"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredToken, clearStoredToken } from "@/lib/admin-auth";
import { fetchAdminPortfolioList } from "@/lib/portfolio-api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    const token = getStoredToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetchAdminPortfolioList(token)
      .then(() => setChecked(true))
      .catch(() => {
        clearStoredToken();
        router.replace("/admin/login");
      });
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (!checked) return <div className="min-h-screen flex items-center justify-center text-sm opacity-60">Checking session...</div>;

  return <div className="min-h-screen">{children}</div>;
}
