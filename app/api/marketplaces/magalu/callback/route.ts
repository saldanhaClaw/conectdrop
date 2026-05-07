import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMagaluTokens } from "@/lib/magalu";
import { encrypt } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=magalu`);
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, "base64").toString());
    const tokens = await getMagaluTokens(code);

    await prisma.canal_Config.upsert({
      where: { userId_canal: { userId, canal: "MAGALU" } },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
        ativo: true,
      },
      create: {
        userId,
        canal: "MAGALU",
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?success=magalu`);
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=magalu`);
  }
}
