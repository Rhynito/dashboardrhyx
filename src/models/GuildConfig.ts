// src/models/GuildConfig.ts
import mongoose, { Schema, model, models } from "mongoose";

const TicketCategorySchema = new Schema({
  ticketCategoryId: String,
  staffRoleId: String,
  name: String,
  embedColor: Number
}, { _id: false });

const TicketConfigSchema = new Schema({
  categories: { type: Map, of: TicketCategorySchema },
  staffRoleId: String,
  embedChannelId: String
}, { _id: false });

const GuildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: "!" },
  ticketCounter: { type: Number, default: 0 },
  ticketConfig: TicketConfigSchema,
  customCommands: { type: [String], default: [] }
});

export const GuildConfig = models.GuildConfig || model("GuildConfig", GuildConfigSchema);

// src/models/GuildInfo.ts
import mongoose, { Schema, model, models } from "mongoose";

const GuildInfoSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  name: String,
  ownerId: String,
  joinedAt: { type: Date, default: Date.now }
});

export const GuildInfo = models.GuildInfo || model("GuildInfo", GuildInfoSchema);
