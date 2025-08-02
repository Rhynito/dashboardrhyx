// src/lib/discord.ts
import axios from "axios";

const API_BASE = "https://discord.com/api";

export async function getUserInfo(token: string) {
  const res = await axios.get(`${API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getUserGuilds(token: string) {
  const res = await axios.get(`${API_BASE}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getBotGuilds(botToken: string) {
  const res = await axios.get(`${API_BASE}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${botToken}` }
  });
  return res.data;
}

export async function getGuildChannels(guildId: string, botToken: string) {
  const res = await axios.get(`${API_BASE}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${botToken}` }
  });
  return res.data;
}

export async function getGuildRoles(guildId: string, botToken: string) {
  const res = await axios.get(`${API_BASE}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${botToken}` }
  });
  return res.data;
}

// src/lib/auth.ts
import { cookies } from "next/headers";

export function getAccessToken(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get("discord_token")?.value;
  return token || null;
}

export function requireAuth(): string {
  const token = getAccessToken();
  if (!token) throw new Error("Unauthorized");
  return token;
} 

export function clearAuth() {
  const cookieStore = cookies();
  cookieStore.delete("discord_token");
}
