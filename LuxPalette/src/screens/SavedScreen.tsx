import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getSavedPalettes, deletePalette, renamePalette, movePalette, SavedPalette } from '../utils/storage';
import SavedPaletteCard from '../components/SavedPaletteCard';
import { ThemeContext } from '../theme/ThemeContext';

const SavedScreen = () => {
  const { theme, isDark } = useContext(ThemeContext);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  const loadPalettes = useCallback(async () => {
    const palettes = await getSavedPalettes();
    setSavedPalettes(palettes.reverse());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPalettes();
    }, [loadPalettes])
  );

  const handleDeletePalette = async (paletteId: string) => {
    await deletePalette(paletteId);
    loadPalettes();
  };

  const handleRenamePalette = async (paletteId: string, newName: string) => {
    await renamePalette(paletteId, newName);
    loadPalettes();
  };

  const handleMovePaletteUp = async (paletteId: string) => {
    await movePalette(paletteId, 'up');
    loadPalettes();
  };

  const handleMovePaletteDown = async (paletteId: string) => {
    await movePalette(paletteId, 'down');
    loadPalettes();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Saved Palettes</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Your personal collection</Text>
      </View>
      <FlatList
        data={savedPalettes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SavedPaletteCard
            palette={item}
            onDelete={handleDeletePalette}
            onRename={handleRenamePalette}
            onMoveUp={handleMovePaletteUp}
            onMoveDown={handleMovePaletteDown}
            isFirst={index === 0}
            isLast={index === savedPalettes.length - 1}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48, paddingBottom: 10 },
  title: { fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', marginBottom: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default SavedScreen;
