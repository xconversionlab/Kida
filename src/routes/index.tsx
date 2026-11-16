import { createFileRoute } from "@tanstack/react-router";
import { RaahApp } from "@/components/raah/RaahApp";

export const Route = createFileRoute("/")({ component: RaahApp });
