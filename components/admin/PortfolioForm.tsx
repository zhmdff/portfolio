"use client";

import { useState, useEffect } from "react";
import {
  UpsertPortfolioItemRequest,
  PortfolioAdminItem,
  DownloadLink,
} from "@/lib/portfolio-api";

interface PortfolioFormProps {
  initialValues?: PortfolioAdminItem;
  onSubmit: (values: UpsertPortfolioItemRequest) => Promise<void>;
  submitLabel: string;
  /** When true, slug is auto-generated from the AZ Name field. Set for new items only. */
  isNew?: boolean;
}

function toRequest(v: Partial<PortfolioAdminItem>): UpsertPortfolioItemRequest {
  return {
    Slug: v.Slug ?? "",
    Published: v.Published ?? false,
    PinnedWeb: v.PinnedWeb ?? false,
    PinnedSoftware: v.PinnedSoftware ?? false,
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
    GithubUrl: v.GithubUrl ?? null,
    Version: v.Version ?? null,
    Platform: v.Platform ?? null,
    Kind: v.Kind ?? "Web",
    DownloadLinks: v.DownloadLinks ?? [],
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const inputCls =
  "border border-foreground/20 rounded px-3 py-2 bg-transparent w-full text-sm focus:outline-none focus:border-foreground/50 transition-colors";
const labelCls = "block text-xs uppercase tracking-widest opacity-50 mb-1";

export default function PortfolioForm({ initialValues, onSubmit, submitLabel, isNew }: PortfolioFormProps) {
  const [values, setValues] = useState<UpsertPortfolioItemRequest>(toRequest(initialValues ?? {}));
  const [detailsText, setDetailsText] = useState((initialValues?.TechnicalDetails ?? []).join("\n"));
  const [detailsEnText, setDetailsEnText] = useState((initialValues?.TechnicalDetailsEn ?? []).join("\n"));
  const [tagsText, setTagsText] = useState((initialValues?.Tags ?? []).join(", "));
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>(initialValues?.DownloadLinks ?? []);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep download links in sync with values
  useEffect(() => {
    setValues((prev) => ({ ...prev, DownloadLinks: downloadLinks }));
  }, [downloadLinks]);

  const set = (key: keyof UpsertPortfolioItemRequest, value: unknown) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const field = (key: keyof UpsertPortfolioItemRequest) => ({
    value: (values[key] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key, e.target.value),
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (isNew && !slugManuallyEdited) {
      setValues((prev) => ({ ...prev, Name: name, Slug: slugify(name) }));
    } else {
      set("Name", name);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    set("Slug", e.target.value);
  };

  const addDownloadLink = () =>
    setDownloadLinks((prev) => [...prev, { Name: "", Url: "" }]);

  const removeDownloadLink = (idx: number) =>
    setDownloadLinks((prev) => prev.filter((_, i) => i !== idx));

  const updateDownloadLink = (idx: number, field: keyof DownloadLink, value: string) =>
    setDownloadLinks((prev) =>
      prev.map((link, i) => (i === idx ? { ...link, [field]: value } : link))
    );

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
        DownloadLinks: downloadLinks.filter((d) => d.Name.trim() && d.Url.trim()),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && <p className="text-sm text-red-500 border border-red-500/30 rounded px-3 py-2">{error}</p>}

      {/* ── Flags ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.Published}
            onChange={(e) => set("Published", e.target.checked)}
            className="rounded"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.PinnedWeb}
            onChange={(e) => set("PinnedWeb", e.target.checked)}
            className="rounded"
          />
          Pinned (Web)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={values.PinnedSoftware}
            onChange={(e) => set("PinnedSoftware", e.target.checked)}
            className="rounded"
          />
          Pinned (Software)
        </label>
      </div>

      {/* ── Core (AZ) ──────────────────────────────────────── */}
      <div className="space-y-4 border-t border-foreground/10 pt-6">
        <p className="text-xs uppercase tracking-widest opacity-40">Content — AZ (Primary)</p>

        {/* Kind */}
        <div>
          <p className={labelCls}>Kind</p>
          <div className="flex gap-4">
            {(["Web", "Software"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="kind"
                  value={k}
                  checked={values.Kind === k}
                  onChange={() => set("Kind", k)}
                />
                {k}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={labelCls}>Name (AZ) *</p>
          <input
            value={values.Name}
            onChange={handleNameChange}
            required
            placeholder="e.g. Layihə Adı"
            className={inputCls}
          />
        </div>
        <div>
          <p className={labelCls}>Subtitle (AZ)</p>
          <input {...field("Subtitle")} placeholder="Short subtitle" className={inputCls} />
        </div>
        <div>
          <p className={labelCls}>Description (AZ) *</p>
          <textarea
            {...field("Description")}
            required
            rows={3}
            placeholder="Project description in Azerbaijani"
            className={inputCls}
          />
        </div>
        <div>
          <p className={labelCls}>Technical Details (AZ) — one per line</p>
          <textarea
            value={detailsText}
            onChange={(e) => setDetailsText(e.target.value)}
            rows={4}
            placeholder={"Built with .NET 8\nPostgreSQL database"}
            className={inputCls}
          />
        </div>
      </div>

      {/* ── EN Content (collapsed) ─────────────────────────── */}
      <details className="border border-foreground/10 rounded">
        <summary className="px-4 py-3 text-xs uppercase tracking-widest opacity-50 cursor-pointer select-none hover:opacity-80 transition-opacity">
          Content — EN (Secondary, collapsed by default)
        </summary>
        <div className="p-4 space-y-4 border-t border-foreground/10">
          <div>
            <p className={labelCls}>Name (EN) *</p>
            <input {...field("NameEn")} required placeholder="e.g. Project Name" className={inputCls} />
          </div>
          <div>
            <p className={labelCls}>Subtitle (EN)</p>
            <input {...field("SubtitleEn")} placeholder="Short subtitle" className={inputCls} />
          </div>
          <div>
            <p className={labelCls}>Description (EN) *</p>
            <textarea
              {...field("DescriptionEn")}
              required
              rows={3}
              placeholder="Project description in English"
              className={inputCls}
            />
          </div>
          <div>
            <p className={labelCls}>Technical Details (EN) — one per line</p>
            <textarea
              value={detailsEnText}
              onChange={(e) => setDetailsEnText(e.target.value)}
              rows={4}
              placeholder={"Built with .NET 8\nPostgreSQL database"}
              className={inputCls}
            />
          </div>
        </div>
      </details>

      {/* ── Metadata ───────────────────────────────────────── */}
      <div className="space-y-4 border-t border-foreground/10 pt-6">
        <p className="text-xs uppercase tracking-widest opacity-40">Metadata</p>
        <div>
          <p className={labelCls}>Tags — comma separated (e.g. NEXT, TS, C#)</p>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="NEXT, TS, DOTNET"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Links ──────────────────────────────────────────── */}
      <div className="space-y-4 border-t border-foreground/10 pt-6">
        <p className="text-xs uppercase tracking-widest opacity-40">Links</p>
        <div>
          <p className={labelCls}>Live URL (web projects)</p>
          <input {...field("Url")} type="url" placeholder="https://example.com" className={inputCls} />
        </div>
        <div>
          <p className={labelCls}>GitHub URL</p>
          <input {...field("GithubUrl")} type="url" placeholder="https://github.com/user/repo" className={inputCls} />
        </div>
      </div>

      {/* ── Software / Release ─────────────────────────────── */}
      <div className="space-y-4 border-t border-foreground/10 pt-6">
        <p className="text-xs uppercase tracking-widest opacity-40">Software / Release</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={labelCls}>Version (e.g. 1.0.0)</p>
            <input {...field("Version")} placeholder="1.0.0" className={inputCls} />
          </div>
          <div>
            <p className={labelCls}>Platform (e.g. Windows)</p>
            <input {...field("Platform")} placeholder="Windows" className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Download Links (URL-based) ─────────────────────── */}
      <div className="space-y-4 border-t border-foreground/10 pt-6">
        <p className="text-xs uppercase tracking-widest opacity-40">Download Links (URL-based)</p>
        <p className="text-xs opacity-40">
          Add named download options (e.g. GitHub Release, MSI Installer, EXE). These are separate from a file upload.
        </p>
        <div className="space-y-3">
          {downloadLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <div className="flex-none w-36">
                <input
                  value={link.Name}
                  onChange={(e) => updateDownloadLink(idx, "Name", e.target.value)}
                  placeholder="GitHub Release"
                  className={inputCls}
                />
              </div>
              <div className="flex-1">
                <input
                  value={link.Url}
                  onChange={(e) => updateDownloadLink(idx, "Url", e.target.value)}
                  placeholder="https://github.com/user/repo/releases/..."
                  type="url"
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={() => removeDownloadLink(idx)}
                className="text-foreground/40 hover:text-red-500 transition-colors px-2 py-2 text-lg leading-none flex-none"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDownloadLink}
          className="text-xs uppercase tracking-widest border border-foreground/20 px-3 py-1.5 hover:border-foreground/50 transition-colors"
        >
          + Add Download Option
        </button>
      </div>

      {/* ── Slug ───────────────────────────────────────────── */}
      <div className="space-y-2 border-t border-foreground/10 pt-6">
        <p className={labelCls}>
          Slug
          {isNew && !slugManuallyEdited && (
            <span className="ml-2 text-foreground/30 normal-case tracking-normal">
              (auto-generated from name — click to override)
            </span>
          )}
        </p>
        <input
          value={values.Slug}
          onChange={handleSlugChange}
          required
          placeholder="my-project-slug"
          className={inputCls}
        />
        {!isNew && (
          <p className="text-xs text-amber-500/80">
            ⚠ Changing the slug will break existing links and bookmarks.
          </p>
        )}
        <p className="text-xs opacity-30">
          Lowercase letters, numbers, and hyphens only (e.g. my-project).
        </p>
      </div>

      <button type="submit" disabled={saving} className="btn-geometric px-6 py-2.5 disabled:opacity-50">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
