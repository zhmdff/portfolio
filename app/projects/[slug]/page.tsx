import { notFound } from "next/navigation";
import { fetchPortfolioDetail, downloadUrl } from "@/lib/portfolio-api";
import DetailClient from "./DetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchPortfolioDetail(slug);
  if (!project) notFound();

  return <DetailClient project={project} downloadHref={downloadUrl(project.Id)} />;
}
