import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShopeeTokens } from "@/lib/shopee";
import { encrypt } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const shopId = searchParams.get("shop_id");
  const state = searchParams.get("state");

  if (!code || !shopId || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=shopee`);
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, "base64").toString());
    const tokens = await getShopeeTokens(code, parseInt(shopId));

    await prisma.canal_Config.upsert({
      where: { userId_canal: { userId, canal: "SHOPEE" } },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        ativo: true,
      },
      create: {
        userId,
        canal: "SHOPEE",
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?success=shopee`);
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor/canais?erro=shopee`);
  }
}
