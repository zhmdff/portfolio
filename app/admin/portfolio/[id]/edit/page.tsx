"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PortfolioForm from "@/components/admin/PortfolioForm";
import {
  fetchAdminPortfolioItem,
  updatePortfolioItem,
  uploadPortfolioImage,
  uploadPortfolioFile,
  UpsertPortfolioItemRequest,
  PortfolioAdminItem,
} from "@/lib/portfolio-api";
import { getStoredToken } from "@/lib/admin-auth";

export default function EditPortfolioItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [item, setItem] = useState<PortfolioAdminItem | null>(null);
  const [uploading, setUploading] = useState<"image" | "file" | null>(null);

  const token = getStoredToken();

  const load = async () => {
    if (!token) return;
    const data = await fetchAdminPortfolioItem(token, id);
    setItem(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: UpsertPortfolioItemRequest) => {
    if (!token) return;
    await updatePortfolioItem(token, id, values);
    router.push("/admin/portfolio");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading("image");
    await uploadPortfolioImage(token, id, file);
    await load();
    setUploading(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading("file");
    await uploadPortfolioFile(token, id, file);
    await load();
    setUploading(null);
  };

  if (!item) return <div className="p-8 text-sm opacity-60">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-light">Edit Portfolio Item</h1>

      <div className="flex gap-8 border-b border-foreground/10 pb-6">
        <div>
          <p className="text-sm mb-2">Cover image {item.Image && "(set)"}</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading === "image"} />
        </div>
        <div>
          <p className="text-sm mb-2">Downloadable file {item.FileName && `(${item.FileName})`}</p>
          <input type="file" onChange={handleFileUpload} disabled={uploading === "file"} />
        </div>
      </div>

      <PortfolioForm initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
