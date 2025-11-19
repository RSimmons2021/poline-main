import { type Palette, type InsertPalette, palettes } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPalettes(): Promise<Palette[]>;
  createPalette(palette: InsertPalette): Promise<Palette>;
  deletePalette(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPalettes(): Promise<Palette[]> {
    return await db.select().from(palettes).orderBy(desc(palettes.createdAt));
  }

  async createPalette(insertPalette: InsertPalette): Promise<Palette> {
    const [palette] = await db
      .insert(palettes)
      .values(insertPalette)
      .returning();
    return palette;
  }

  async deletePalette(id: number): Promise<void> {
    await db.delete(palettes).where(eq(palettes.id, id));
  }
}

export const storage = new DatabaseStorage();
