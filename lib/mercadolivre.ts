const ML_BASE_URL = "https://api.mercadolibre.com";

export function getMercadoLivreAuthUrl(state: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.ML_APP_ID!,
    redirect_uri: process.env.ML_REDIRECT_URI!,
    state,
  });
  return `https://auth.mercadolivre.com.br/authorization?${params}`;
}

export async function getMercadoLivreTokens(code: string) {
  const res = await fetch(`${ML_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.ML_APP_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.ML_REDIRECT_URI!,
    }),
  });
  if (!res.ok) throw new Error("Falha ao obter tokens do Mercado Livre");
  return res.json();
}

export async function refreshMercadoLivreToken(refreshToken: string) {
  const res = await fetch(`${ML_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ML_APP_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error("Falha ao renovar token do Mercado Livre");
  return res.json();
}

export async function publishToMercadoLivre(
  accessToken: string,
  produto: {
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    imagens: string[];
    nicho: string;
  }
) {
  const categoryMap: Record<string, string> = {
    Pet: "MLB1743",
    Casa: "MLB1574",
    Limpeza: "MLB210715",
    Baby: "MLB1391",
    Saúde: "MLB1246",
    Eletrônicos: "MLB1051",
    Relógios: "MLB1430",
  };

  const item = {
    title: produto.nome,
    category_id: categoryMap[produto.nicho] || "MLB1051",
    price: produto.preco,
    currency_id: "BRL",
    available_quantity: produto.estoque,
    buying_mode: "buy_it_now",
    listing_type_id: "gold_special",
    condition: "new",
    description: { plain_text: produto.descricao },
    pictures: produto.imagens.map((url) => ({ source: url })),
  };

  const res = await fetch(`${ML_BASE_URL}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Erro ML: ${err.message || "Falha ao publicar"}`);
  }
  return res.json();
}

export async function syncStockMercadoLivre(
  accessToken: string,
  itemId: string,
  estoque: number,
  preco: number
) {
  const res = await fetch(`${ML_BASE_URL}/items/${itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ available_quantity: estoque, price: preco }),
  });
  if (!res.ok) throw new Error("Falha ao sincronizar estoque no ML");
  return res.json();
}
