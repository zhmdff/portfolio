"use client";

import { useState } from "react";
import { UpsertPortfolioItemRequest, PortfolioAdminItem } from "@/lib/portfolio-api";

interface PortfolioFormProps {
  initialValues?: PortfolioAdminItem;
  onSubmit: (values: UpsertPortfolioItemRequest) => Promise<void>;
  submitLabel: string;
}

function toRequest(v: Partial<PortfolioAdminItem>): UpsertPortfolioItemRequest {
  return {
    Slug: v.Slug ?? "",
    Published: v.Published ?? false,
    Name: v.Name ?? "",
    NameEn: v.NameEn ?? "",
    Subtitle: v.Subtitle ?? null,
    SubtitleEn: v.SubtitleEn ?? null,
    Description: v.Description ?? "",
    DescriptionEn: v.DescriptionEn ?? "",
    TechnicalDetails: v.TechnicalDetails ?? [],
    TechnicalDetailsEn: v.TechnicalDetailsEn ?? [],
    Tags: v.Tags ?? [],
    Url: v.Url ?? null,
    Version: v.Version ?? null,
    Platform: v.Platform ?? null,
  };
}

export default function PortfolioForm({ initialValues, onSubmit, submitLabel }: PortfolioFormProps) {
  const [values, setValues] = useState<UpsertPortfolioItemRequest>(toRequest(initialValues ?? {}));
  const [detailsText, setDetailsText] = useState((initialValues?.TechnicalDetails ?? []).join("\n"));
  const [detailsEnText, setDetailsEnText] = useState((initialValues?.TechnicalDetailsEn ?? []).join("\n"));
  const [tagsText, setTagsText] = useState((initialValues?.Tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (key: keyof UpsertPortfolioItemRequest) => ({
    value: (values[key] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({
        ...values,
        TechnicalDetails: detailsText.split("\n").map((s) => s.trim()).filter(Boolean),
        TechnicalDetailsEn: detailsEnText.split("\n").map((s) => s.trim()).filter(Boolean),
        Tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.Published}
          onChange={(e) => setValues((prev) => ({ ...prev, Published: e.target.checked }))}
        />
        Published
      </label>

      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Slug (url-safe)" {...field("Slug")} required className="border border-foreground/20 rounded px-3 py-2 bg-transparent col-span-2" />
        <input placeholder="Name (AZ)" {...field("Name")} required className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
        <input placeholder="Name (EN)" {...field("NameEn")} required className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
        <input placeholder="Subtitle (AZ)" {...field("Subtitle")} className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
        <input placeholder="Subtitle (EN)" {...field("SubtitleEn")} className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
      </div>

      <textarea placeholder="Description (AZ)" {...field("Description")} required rows={3} className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent" />
      <textarea placeholder="Description (EN)" {...field("DescriptionEn")} required rows={3} className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent" />

      <textarea
        placeholder="Technical details (AZ) — one per line"
        value={detailsText}
        onChange={(e) => setDetailsText(e.target.value)}
        rows={4}
        className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent"
      />
      <textarea
        placeholder="Technical details (EN) — one per line"
        value={detailsEnText}
        onChange={(e) => setDetailsEnText(e.target.value)}
        rows={4}
        className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent"
      />

      <input
        placeholder="Tags — comma separated (e.g. NEXT, TS)"
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
        className="w-full border border-foreground/20 rounded px-3 py-2 bg-transparent"
      />

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-foreground/10">
        <input placeholder="Live URL (web projects)" {...field("Url")} className="border border-foreground/20 rounded px-3 py-2 bg-transparent col-span-2" />
        <input placeholder="Version (downloadable apps)" {...field("Version")} className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
        <input placeholder="Platform (e.g. Windows)" {...field("Platform")} className="border border-foreground/20 rounded px-3 py-2 bg-transparent" />
      </div>

      <button type="submit" disabled={saving} className="btn-geometric px-6 py-2.5">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
