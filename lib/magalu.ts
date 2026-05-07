const MAGALU_BASE_URL = "https://api.magalu.com/v1";
void MAGALU_BASE_URL;

export function getMagaluAuthUrl(state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.MAGALU_CLIENT_ID!,
    redirect_uri: process.env.MAGALU_REDIRECT_URI!,
    state,
    scope: "products:write orders:read",
  });
  return `https://id.magalu.com/oauth2/authorize?${params}`;
}

export async function getMagaluTokens(code: string) {
  const credentials = Buffer.from(
    `${process.env.MAGALU_CLIENT_ID}:${process.env.MAGALU_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://id.magalu.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.MAGALU_REDIRECT_URI!,
    }),
  });

  if (!res.ok) throw new Error("Falha ao obter tokens do Magalu");
  return res.json();
}
