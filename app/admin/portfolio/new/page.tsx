"use client";

import { useRouter } from "next/navigation";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { createPortfolioItem, UpsertPortfolioItemRequest } from "@/lib/portfolio-api";
import { getStoredToken } from "@/lib/admin-auth";

export default function NewPortfolioItemPage() {
  const router = useRouter();

  const handleSubmit = async (values: UpsertPortfolioItemRequest) => {
    const token = getStoredToken();
    if (!token) return;
    const created = await createPortfolioItem(token, values);
    router.push(`/admin/portfolio/${created.Id}/edit`);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-light mb-6">New Portfolio Item</h1>
      <PortfolioForm onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}
