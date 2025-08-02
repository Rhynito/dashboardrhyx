// src/app/api/guilds/[id]/config/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { GuildConfig } from "@/models/GuildConfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await connectDB();

    const config = await GuildConfig.findOne({ guildId: params.id });
    if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(config);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await connectDB();

    const body = await req.json();
    const updated = await GuildConfig.findOneAndUpdate(
      { guildId: params.id },
      body,
      { upsert: true, new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
