import { createFileRoute } from "@tanstack/react-router";
import PropertyDetail from "@/pages/PropertyDetail";
import { getShareMeta, shareHead } from "@/lib/shareMeta.functions";

export const Route = createFileRoute("/property/$slug")({
  loader: ({ params }) => getShareMeta({ data: { kind: "property", slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => shareHead(loaderData, `/property/${params.slug}`, "product"),
  component: PropertyDetail,
});
