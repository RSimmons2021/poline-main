import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const palettes = pgTable("palettes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  colors: text("colors").array().notNull(),
  type: text("type").notNull().default("generated"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaletteSchema = createInsertSchema(palettes).pick({
  name: true,
  colors: true,
  type: true,
});

export type InsertPalette = z.infer<typeof insertPaletteSchema>;
export type Palette = typeof palettes.$inferSelect;
