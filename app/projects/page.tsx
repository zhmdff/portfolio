import type { Metadata } from "next";
import { fetchPortfolioList, PortfolioListItem } from "@/lib/portfolio-api";
import ProjectsClient from "./ProjectsClient";

const SITE_URL = "https://zhmdff.com";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web and software projects by Mahmud Ahmadov (zhmdff).",
  alternates: { canonical: `${SITE_URL}/projects` },
};

export default async function ProjectsPage() {
  let projects: PortfolioListItem[] = [];
  try {
    projects = await fetchPortfolioList();
  } catch {
    projects = [];
  }
  return <ProjectsClient projects={projects} />;
}
