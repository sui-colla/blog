import { getSearchIndexItems } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(getSearchIndexItems(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
