"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, AuthGuard } from "@zhmdff/auth-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider authUrl={`${API_URL}/auth`} apiUrl={API_URL} loginPath="/admin/login">
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <AuthGuard
          allowedRoles={["SuperAdmin"]}
          onUnauthenticated={() => router.replace("/admin/login")}
          loadingComponent={
            <div className="min-h-screen flex items-center justify-center text-sm opacity-60">
              Checking session...
            </div>
          }
        >
          <div className="min-h-screen">{children}</div>
        </AuthGuard>
      )}
    </AuthProvider>
  );
}
