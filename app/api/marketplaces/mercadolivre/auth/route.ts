import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMercadoLivreAuthUrl } from "@/lib/mercadolivre";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const state = Buffer.from(JSON.stringify({ userId: session.user.id, ts: Date.now() })).toString("base64");
  const url = getMercadoLivreAuthUrl(state);

  return NextResponse.redirect(url);
}
