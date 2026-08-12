"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, setStoredToken } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(identifier, password);
      if (!result.Success || !result.AccessToken) {
        setError(result.ErrorMessage ?? "Login failed.");
        return;
      }
      setStoredToken(result.AccessToken);
      router.push("/admin/portfolio");
    } catch {
      setError("Network error. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 border border-foreground/10 p-8 rounded-xl">
        <h1 className="text-xl font-light tracking-tight">Admin Login</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username or email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent"
          required
        />
        <button type="submit" disabled={loading} className="btn-geometric w-full py-2.5 justify-center">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
