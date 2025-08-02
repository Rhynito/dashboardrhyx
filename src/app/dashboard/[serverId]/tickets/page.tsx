// src/app/dashboard/[serverId]/tickets/page.tsx
import { useParams } from "next/navigation";
import { useGuildConfig } from "@/hooks/useGuildConfig";

export default function TicketConfigPage() {
  const { serverId } = useParams();
  const { config, loading, error } = useGuildConfig(serverId as string);

  if (loading) return <div className="text-white">Cargando configuración...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!config) return <div className="text-gray-400">No hay datos para mostrar.</div>;

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Configuración de Tickets</h2>
      <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-auto">
        {JSON.stringify(config.ticketConfig, null, 2)}
      </pre>
    </div>
  );
}
