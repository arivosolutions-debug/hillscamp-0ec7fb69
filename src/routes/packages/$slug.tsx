import { createFileRoute } from "@tanstack/react-router";
import PackageDetail from "@/pages/PackageDetail";
import { getShareMeta, shareHead } from "@/lib/shareMeta.functions";

export const Route = createFileRoute("/packages/$slug")({
  loader: ({ params }) => getShareMeta({ data: { kind: "package", slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => shareHead(loaderData, `/packages/${params.slug}`, "product"),
  component: PackageDetail,
});
