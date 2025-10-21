import AsyncStorage from '@react-native-async-storage/async-storage';

const PALETTES_KEY = 'saved_palettes';
const SETTINGS_KEY = 'app_settings';

export interface SavedPalette {
  id: string;
  name: string;
  colors: number[][];
}

export interface AppSettings {
  reduceMotion: boolean;
  isDarkTheme: boolean;
  numPoints: number; // New property
}

export const getSavedPalettes = async (): Promise<SavedPalette[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PALETTES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load palettes.', e);
    return [];
  }
};

export const savePalette = async (paletteToSave: Omit<SavedPalette, 'id'>): Promise<void> => {
  try {
    const existingPalettes = await getSavedPalettes();
    const newPalette: SavedPalette = {
      id: new Date().toISOString(),
      ...paletteToSave,
    };
    const newPalettes = [...existingPalettes, newPalette];
    const jsonValue = JSON.stringify(newPalettes);
    await AsyncStorage.setItem(PALETTES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save palette.', e);
  }
};

export const deletePalette = async (paletteId: string): Promise<void> => {
  try {
    const existingPalettes = await getSavedPalettes();
    const newPalettes = existingPalettes.filter((p) => p.id !== paletteId);
    const jsonValue = JSON.stringify(newPalettes);
    await AsyncStorage.setItem(PALETTES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to delete palette.', e);
  }
};

export const renamePalette = async (paletteId: string, newName: string): Promise<void> => {
  try {
    const existingPalettes = await getSavedPalettes();
    const newPalettes = existingPalettes.map((p) =>
      p.id === paletteId ? { ...p, name: newName } : p
    );
    const jsonValue = JSON.stringify(newPalettes);
    await AsyncStorage.setItem(PALETTES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to rename palette.', e);
  }
};

export const movePalette = async (paletteId: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    const existingPalettes = await getSavedPalettes();
    const index = existingPalettes.findIndex((p) => p.id === paletteId);

    if (index === -1) {
      return;
    }

    const newPalettes = [...existingPalettes];
    const [movedPalette] = newPalettes.splice(index, 1);

    if (direction === 'up' && index > 0) {
      newPalettes.splice(index - 1, 0, movedPalette);
    } else if (direction === 'down' && index < newPalettes.length) {
      newPalettes.splice(index + 1, 0, movedPalette);
    } else {
      return; // Cannot move further in this direction
    }

    const jsonValue = JSON.stringify(newPalettes);
    await AsyncStorage.setItem(PALETTES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to move palette.', e);
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : { reduceMotion: false, isDarkTheme: true, numPoints: 5 };
  } catch (e) {
    console.error('Failed to load settings.', e);
    return { reduceMotion: false, isDarkTheme: true, numPoints: 5 };
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save settings.', e);
  }
};