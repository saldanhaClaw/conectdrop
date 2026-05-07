import crypto from "crypto";

const SHOPEE_BASE_URL = "https://partner.shopeemobile.com";

function generateShopeeSign(path: string, timestamp: number, body = "") {
  const baseString = `${process.env.SHOPEE_PARTNER_ID}${path}${timestamp}${body}`;
  return crypto
    .createHmac("sha256", process.env.SHOPEE_PARTNER_KEY!)
    .update(baseString)
    .digest("hex");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getShopeeAuthUrl(_shopId: string, _state: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const path = "/api/v2/shop/auth_partner";
  const sign = generateShopeeSign(path, timestamp);

  const params = new URLSearchParams({
    partner_id: process.env.SHOPEE_PARTNER_ID!,
    timestamp: String(timestamp),
    sign,
    redirect: process.env.SHOPEE_REDIRECT_URI!,
  });

  return `${SHOPEE_BASE_URL}${path}?${params}`;
}

export async function getShopeeTokens(
  code: string,
  shopId: number
): Promise<{ access_token: string; refresh_token: string }> {
  const timestamp = Math.floor(Date.now() / 1000);
  const path = "/api/v2/auth/token/get";
  const body = JSON.stringify({
    code,
    shop_id: shopId,
    partner_id: parseInt(process.env.SHOPEE_PARTNER_ID!),
  });
  const sign = generateShopeeSign(path, timestamp);

  const res = await fetch(`${SHOPEE_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: sign,
    },
    body,
  });

  if (!res.ok) throw new Error("Falha ao obter tokens da Shopee");
  return res.json();
}
