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

// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ No Mongo URI defined in environment");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: "rhyxBotDB"
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
