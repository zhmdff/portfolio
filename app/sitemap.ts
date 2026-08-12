import { MetadataRoute } from "next";
import { fetchPortfolioList } from "@/lib/portfolio-api";

const SITE_URL = "https://zhmdff.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const projects = await fetchPortfolioList();
    const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.Slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
    return [...staticEntries, ...projectEntries];
  } catch {
    return staticEntries;
  }
}
