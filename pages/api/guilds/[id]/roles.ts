// /pages/api/guilds/[id]/roles.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const guildId = params.id;
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`
    }
  });

  const data = await res.json();
  return NextResponse.json(data);
}
