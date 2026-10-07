import { createFileRoute } from "@tanstack/react-router";
import MunnarHomestays from "@/pages/MunnarHomestays";

export const Route = createFileRoute("/munnar-homestays")({
  component: MunnarHomestays,
});
