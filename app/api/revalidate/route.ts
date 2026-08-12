import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  // Next 16's revalidateTag requires a cache-life profile as the 2nd arg;
  // { expire: 300 } mirrors the 300s fallback revalidate window used by the
  // tagged fetches in lib/portfolio-api.ts.
  revalidateTag("portfolio", { expire: 300 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
