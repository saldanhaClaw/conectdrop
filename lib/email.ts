import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "noreply@dropconnect.com.br";

export async function sendWelcomeEmail(email: string, nome: string, role: string) {
  const roleLabel = role === "VENDEDOR" ? "vendedor" : "fornecedor";
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${roleLabel}`;

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Bem-vindo ao DropConnect!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">DROP<span style="color: #1e293b;">CONNECT</span></h1>
        <h2>Olá, ${nome}!</h2>
        <p>Sua conta foi criada com sucesso como <strong>${roleLabel}</strong>.</p>
        <p>Acesse sua área exclusiva e comece agora:</p>
        <a href="${dashboardUrl}" style="background:#ef4444;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:16px 0;">
          Acessar Dashboard
        </a>
        <p style="color:#64748b;font-size:14px;">Equipe DropConnect</p>
      </div>
    `,
  });
}

export async function sendPaymentSuccessEmail(
  email: string,
  nome: string,
  planoNome: string,
  valor: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Assinatura ativada — DropConnect",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">DROP<span style="color:#1e293b;">CONNECT</span></h1>
        <h2>Pagamento confirmado!</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Sua assinatura do plano <strong>${planoNome}</strong> (${valor}) foi ativada.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor" style="background:#ef4444;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:16px 0;">
          Acessar Plataforma
        </a>
        <p style="color:#64748b;font-size:14px;">Equipe DropConnect</p>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail(email: string, nome: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Problema no pagamento — DropConnect",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">DROP<span style="color:#1e293b;">CONNECT</span></h1>
        <h2>Atenção, ${nome}</h2>
        <p>Não conseguimos processar seu pagamento. Por favor, atualize seus dados de cobrança.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/portal" style="background:#ef4444;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:16px 0;">
          Atualizar Pagamento
        </a>
        <p style="color:#64748b;font-size:14px;">Equipe DropConnect</p>
      </div>
    `,
  });
}

export async function sendLowStockAlert(
  email: string,
  nome: string,
  produtos: { nome: string; estoque: number }[]
) {
  const listItems = produtos
    .map((p) => `<li><strong>${p.nome}</strong>: ${p.estoque} unidades</li>`)
    .join("");

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Alerta de estoque baixo — DropConnect",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ef4444;">DROP<span style="color:#1e293b;">CONNECT</span></h1>
        <h2>Alerta de Estoque</h2>
        <p>Olá, <strong>${nome}</strong>! Os seguintes produtos estão com estoque baixo:</p>
        <ul>${listItems}</ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fornecedor/produtos" style="background:#ef4444;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;margin:16px 0;">
          Atualizar Estoque
        </a>
      </div>
    `,
  });
}
