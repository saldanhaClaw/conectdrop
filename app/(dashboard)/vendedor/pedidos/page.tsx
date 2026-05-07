import { ShoppingCart, Clock } from "lucide-react";

export default function PedidosPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-white/40 text-sm mt-1">Acompanhe todos os pedidos dos seus anúncios</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.05]">
          <ShoppingCart className="h-10 w-10 text-white/20" />
        </div>
        <div>
          <p className="text-white/60 font-medium">Nenhum pedido ainda</p>
          <p className="text-white/30 text-sm mt-1 max-w-xs">
            Quando seus anúncios receberem pedidos, eles aparecerão aqui com todos os detalhes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 bg-white/[0.04] px-4 py-2 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          Integração de pedidos em breve
        </div>
      </div>
    </div>
  );
}
