import { createFileRoute } from "@tanstack/react-router";
import Experiences from "@/pages/Packages";

export const Route = createFileRoute("/packages/")({
  component: Experiences,
});
