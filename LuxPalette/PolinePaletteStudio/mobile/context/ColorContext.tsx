import React, { createContext, useContext, useState, useEffect } from "react";
import { generateRandomColor, generatePolinePalette } from "../lib/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Palette type for now
export type Palette = {
    id: number;
    name: string;
    colors: string[];
    type: string;
    createdAt?: string;
};

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
    const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);

    // Load saved palettes from AsyncStorage on mount
    useEffect(() => {
        loadPalettes();
    }, []);

    const loadPalettes = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@saved_palettes');
            if (jsonValue != null) {
                setSavedPalettes(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Failed to load palettes", e);
        }
    };

    const savePalettesToStorage = async (palettes: Palette[]) => {
        try {
            const jsonValue = JSON.stringify(palettes);
            await AsyncStorage.setItem('@saved_palettes', jsonValue);
        } catch (e) {
            console.error("Failed to save palettes", e);
        }
    };

    const generateNewPalette = () => {
        const c1 = generateRandomColor();
        const c2 = generateRandomColor();
        const newPalette = generatePolinePalette(c1, c2, 5);
        setPalette(newPalette);
        setActiveColor(newPalette[0]);
    };

    const saveCurrentPalette = (name?: string) => {
        const newPalette: Palette = {
            id: Date.now(),
            name: name || "Untitled Palette",
            colors: palette,
            type: "generated",
            createdAt: new Date().toISOString()
        };

        const updatedPalettes = [...savedPalettes, newPalette];
        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);
    };

    const deletePalette = (id: number) => {
        const updatedPalettes = savedPalettes.filter(p => p.id !== id);
        setSavedPalettes(updatedPalettes);
        savePalettesToStorage(updatedPalettes);
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
