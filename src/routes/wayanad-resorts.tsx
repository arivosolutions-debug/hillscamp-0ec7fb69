import { createFileRoute } from "@tanstack/react-router";
import WayanadResorts from "@/pages/WayanadResorts";

export const Route = createFileRoute("/wayanad-resorts")({
  component: WayanadResorts,
});
