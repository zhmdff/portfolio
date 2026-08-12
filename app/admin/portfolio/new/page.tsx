"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@zhmdff/auth-react";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { createPortfolioItem, UpsertPortfolioItemRequest } from "@/lib/portfolio-api";

export default function NewPortfolioItemPage() {
  const router = useRouter();
  const { fetch: authFetch } = useAuth();

  const handleSubmit = async (values: UpsertPortfolioItemRequest) => {
    const created = await createPortfolioItem(authFetch, values);
    router.push(`/admin/portfolio/${created.Id}/edit`);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-light mb-6">New Portfolio Item</h1>
      <PortfolioForm onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}
