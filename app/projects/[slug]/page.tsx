import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { fetchPortfolioDetail, downloadUrl, imageUrl } from "@/lib/portfolio-api";
import DetailClient from "./DetailClient";

const SITE_URL = "https://zhmdff.com";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchPortfolioDetail(slug);
  if (!project) {
    return { title: "Project not found" };
  }

  const title = project.NameEn || project.Name;
  const description =
    (project.DescriptionEn || project.Description).slice(0, 160) ||
    `${title} — project by Mahmud Ahmadov (zhmdff).`;
  const canonical = `${SITE_URL}/projects/${project.Slug}`;
  const ogImage = imageUrl(project.Image) ?? `${SITE_URL}/icon.jpg`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${title} | Mahmud Ahmadov`,
      description,
      siteName: "Mahmud Ahmadov Portfolio",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Mahmud Ahmadov`,
      description,
      images: [ogImage],
      creator: "@zhmdff",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await fetchPortfolioDetail(slug);
  if (!project) notFound();

  const name = project.NameEn || project.Name;
  const description = project.DescriptionEn || project.Description;
  const image = imageUrl(project.Image);
  const pageUrl = `${SITE_URL}/projects/${project.Slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": project.FileName ? "SoftwareApplication" : "CreativeWork",
    name,
    alternateName: project.Name !== project.NameEn ? [project.Name, project.NameEn] : undefined,
    description,
    url: pageUrl,
    image: image ? [image] : undefined,
    keywords: project.Tags.length ? project.Tags.join(", ") : undefined,
    author: {
      "@type": "Person",
      name: "Mahmud Ahmadov",
      alternateName: "zhmdff",
      url: SITE_URL,
    },
    ...(project.FileName
      ? {
          applicationCategory: "DeveloperApplication",
          operatingSystem: project.Platform ?? undefined,
          softwareVersion: project.Version ?? undefined,
          downloadUrl: downloadUrl(project.Id),
        }
      : {}),
    ...(project.Url ? { sameAs: [project.Url] } : {}),
  };

  return (
    <>
      <Script
        id={`json-ld-project-${project.Slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailClient project={project} downloadHref={downloadUrl(project.Id)} />
    </>
  );
}
