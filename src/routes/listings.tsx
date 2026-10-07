import { createFileRoute } from "@tanstack/react-router";
import Listings from "@/pages/Listings";

export const Route = createFileRoute("/listings")({
  component: Listings,
});
