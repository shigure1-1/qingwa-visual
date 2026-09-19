import { NextResponse } from "next/server";
import { getCommerceReadiness } from "@/lib/commerce/runtime";

export const dynamic = "force-dynamic";

export function GET() {
  const readiness = getCommerceReadiness();
  return NextResponse.json(
    {
      ok: true,
      mode: "mode" in readiness ? readiness.mode : "catalog",
      ready: readiness.ready,
      availableProviders: "availableProviders" in readiness ? readiness.availableProviders : [],
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
