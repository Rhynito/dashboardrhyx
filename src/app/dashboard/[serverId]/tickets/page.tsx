// src/app/dashboard/[serverId]/tickets/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useGuildConfig } from "@/hooks/useGuildConfig";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function TicketConfigPage() {
  const { serverId } = useParams();
  const router = useRouter();
  const { config, loading, error, setConfig } = useGuildConfig(serverId as string);
  const [categories, setCategories] = useState<any>([]);
  const [newKey, setNewKey] = useState("");
  const [unsaved, setUnsaved] = useState(false);
  const [channelOptions, setChannelOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    if (config?.ticketConfig?.categories) {
      setCategories(Object.entries(config.ticketConfig.categories));
    }
  }, [config]);

  useEffect(() => {
    if (!serverId) return;

    fetch(`/api/guilds/${serverId}/channels`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((ch: any) => ch.type === 4); // Solo categorías
        setChannelOptions(filtered.map((ch: any) => ({ id: ch.id, name: ch.name })));
      });

    fetch(`/api/guilds/${serverId}/roles`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((role: any) => !role.managed && role.name !== "@everyone");
        setRoleOptions(filtered.map((r: any) => ({ id: r.id, name: r.name })));
      });
  }, [serverId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "Tienes cambios sin guardar. ¿Estás seguro de salir?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsaved]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const newCategories = [...categories];
    newCategories[index][1][field] = value;
    setCategories(newCategories);
    setUnsaved(true);
  };

  const handleAddCategory = () => {
    if (!newKey.trim()) return;
    const defaultEntry = {
      name: newKey,
      ticketCategoryId: "",
      staffRoleId: "",
      embedColor: 16711680
    };
    setCategories([...categories, [newKey, defaultEntry]]);
    setNewKey("");
    setUnsaved(true);
  };

  const handleDelete = (index: number) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
    setUnsaved(true);
  };

  const handleSave = async () => {
    const updatedCategories = Object.fromEntries(categories);
    const res = await fetch(`/api/guilds/${serverId}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketConfig: {
          ...config.ticketConfig,
          categories: updatedCategories
        }
      })
    });
    const data = await res.json();
    setConfig(data);
    setUnsaved(false);
  };

  if (loading) return <div className="text-white">Cargando configuración...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!categories) return <div className="text-gray-400">No hay datos para mostrar.</div>;

  return (
    <div className="text-white max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Configuración de Tickets</h2>

      <Accordion type="multiple" className="space-y-4">
        {categories.map(([key, cat], index) => (
          <AccordionItem key={key} value={key} className="border border-white/10 rounded-lg">
            <AccordionTrigger>
              <div className="text-lg font-semibold">{cat.name || key}</div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre visible</Label>
                  <Input
                    value={cat.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Canal</Label>
                  <Select
                    value={cat.ticketCategoryId}
                    onValueChange={(val) => handleInputChange(index, "ticketCategoryId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {channelOptions.map((ch) => (
                        <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rol Staff</Label>
                  <Select
                    value={cat.staffRoleId}
                    onValueChange={(val) => handleInputChange(index, "staffRoleId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Color del embed</Label>
                  <Input
                    type="color"
                    value={`#${(cat.embedColor || 0).toString(16).padStart(6, "0")}`}
                    onChange={(e) => handleInputChange(index, "embedColor", parseInt(e.target.value.slice(1), 16))}
                  />
                </div>
              </div>
              <div className="text-right mt-4">
                <Button variant="destructive" onClick={() => handleDelete(index)}>
                  Eliminar categoría
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label>Nueva categoría</Label>
            <Input
              placeholder="Nombre interno (clave)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCategory} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Añadir
          </Button>
        </div>

        <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
