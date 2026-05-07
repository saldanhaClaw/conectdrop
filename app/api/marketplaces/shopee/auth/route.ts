import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getShopeeAuthUrl } from "@/lib/shopee";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const state = Buffer.from(JSON.stringify({ userId: session.user.id })).toString("base64");
  const url = getShopeeAuthUrl("", state);
  return NextResponse.redirect(url);
}
