import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/pages/Blog";
import { getShareMeta, shareHead } from "@/lib/shareMeta.functions";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => getShareMeta({ data: { kind: "post", slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => shareHead(loaderData, `/journal/${params.slug}`, "article"),
  component: BlogPost,
});
