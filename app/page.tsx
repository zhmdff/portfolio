import { fetchPinnedPortfolioListServer } from "@/lib/portfolio-api";
import HomeClient from "./HomeClient";

export const revalidate = 300;

export default async function Home() {
  const [webProjects, softwareProjects] = await Promise.all([
    fetchPinnedPortfolioListServer("web"),
    fetchPinnedPortfolioListServer("software"),
  ]);
  return <HomeClient webProjects={webProjects} softwareProjects={softwareProjects} />;
}
