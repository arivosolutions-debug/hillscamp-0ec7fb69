import { createFileRoute } from "@tanstack/react-router";
import PackageDetail from "@/pages/PackageDetail";

export const Route = createFileRoute("/packages/$slug")({
  component: PackageDetail,
});
