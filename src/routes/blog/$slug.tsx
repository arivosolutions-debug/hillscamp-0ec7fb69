import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/pages/Blog";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
});
