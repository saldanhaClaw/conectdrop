import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMercadoLivreTokens } from "@/lib/mercadolivre";
import { encrypt } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=1`);
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, "base64").toString());
    const tokens = await getMercadoLivreTokens(code);

    await prisma.canal_Config.upsert({
      where: { userId_canal: { userId, canal: "MERCADO_LIVRE" } },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        ativo: true,
      },
      create: {
        userId,
        canal: "MERCADO_LIVRE",
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?success=ml`);
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=1`);
  }
}
