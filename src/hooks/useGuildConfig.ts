// src/hooks/useGuildConfig.ts
import { useEffect, useState } from "react";

export function useGuildConfig(guildId: string) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guildId) return;

    setLoading(true);
    fetch(`/api/guilds/${guildId}/config`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setConfig(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [guildId]);

  return { config, loading, error, setConfig };
}
