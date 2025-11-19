import React, { createContext, useContext, useState } from "react";
import { generateRandomColor, generatePolinePalette } from "@/lib/colors";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Palette, InsertPalette } from "@shared/schema";

type ColorContextType = {
  palette: string[];
  setPalette: (colors: string[]) => void;
  generateNewPalette: () => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  savedPalettes: Palette[];
  saveCurrentPalette: (name?: string) => void;
  deletePalette: (id: number) => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<string[]>([
    "#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"
  ]);
  const [activeColor, setActiveColor] = useState<string>("#E63946");
  
  const queryClient = useQueryClient();

  // Fetch saved palettes from API
  const { data: savedPalettes = [] } = useQuery<Palette[]>({
    queryKey: ["/api/palettes"],
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (newPalette: InsertPalette) => {
      const res = await apiRequest("POST", "/api/palettes", newPalette);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/palettes"] });
      toast({
        title: "Palette Saved",
        description: "Your palette has been added to the library.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save palette.",
        variant: "destructive",
      });
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/palettes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/palettes"] });
      toast({
        title: "Palette Deleted",
        description: "Removed from your library.",
      });
    }
  });

  const generateNewPalette = () => {
    const c1 = generateRandomColor();
    const c2 = generateRandomColor();
    const newPalette = generatePolinePalette(c1, c2, 5);
    setPalette(newPalette);
    setActiveColor(newPalette[0]);
  };

  const saveCurrentPalette = (name?: string) => {
    saveMutation.mutate({
      name: name || "Untitled Palette",
      colors: palette,
      type: "generated" // We could pass this in if we want to distinguish types later
    });
  };

  const deletePalette = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <ColorContext.Provider value={{ 
      palette, 
      setPalette, 
      generateNewPalette, 
      activeColor, 
      setActiveColor,
      savedPalettes,
      saveCurrentPalette,
      deletePalette
    }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColors must be used within a ColorProvider");
  }
  return context;
}
