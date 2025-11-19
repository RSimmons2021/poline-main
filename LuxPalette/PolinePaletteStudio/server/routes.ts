import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaletteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/palettes", async (req, res) => {
    const palettes = await storage.getPalettes();
    res.json(palettes);
  });

  app.post("/api/palettes", async (req, res) => {
    const parsed = insertPaletteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid palette data" });
      return;
    }
    const palette = await storage.createPalette(parsed.data);
    res.json(palette);
  });

  app.delete("/api/palettes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }
    await storage.deletePalette(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
