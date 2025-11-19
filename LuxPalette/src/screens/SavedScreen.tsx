import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Poline } from 'poline';
import Animated, { useSharedValue, withTiming, withRepeat, Easing, cancelAnimation } from 'react-native-reanimated';
import { getSavedPalettes, deletePalette, renamePalette, movePalette, savePalette, SavedPalette } from '../utils/storage';
import SavedPaletteCard from '../components/SavedPaletteCard';
import { ThemeContext } from '../theme/ThemeContext';
import AnimatedTile from '../components/AnimatedTile';
import { getContrastTextColor, hslToHex, rgbToHsl } from '../utils/colors';

const { width } = Dimensions.get('window');

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const SavedScreen = () => {
  const { theme, isDark, reduceMotion, numPoints } = useContext(ThemeContext);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);

  // Dictionary State
  const [dictionaryPalette, setDictionaryPalette] = useState<number[][]>([]);
  const [colorCombos, setColorCombos] = useState([]);
  const pulse = useSharedValue(0);

  const loadPalettes = useCallback(async () => {
    const palettes = await getSavedPalettes();
    setSavedPalettes(palettes.reverse());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPalettes();
    }, [loadPalettes])
  );

  // Dictionary Logic
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json')
      .then(response => response.json())
      .then(data => {
        setColorCombos(data);
      });
  }, []);

  const generateDictionaryPalette = () => {
    if (colorCombos.length > 0) {
      let anchorColors = [];
      while (anchorColors.length < 2) {
        const randomColor = colorCombos[Math.floor(Math.random() * colorCombos.length)];
        anchorColors = [randomColor.rgb];
        if (randomColor.combinations) {
          randomColor.combinations.forEach(comboIndex => {
            if (colorCombos[comboIndex]) {
              anchorColors.push(colorCombos[comboIndex].rgb);
            }
          });
        }
      }

      const hslAnchorColors = anchorColors.map(color => rgbToHsl(color[0], color[1], color[2]));
      const gen = new Poline({ anchorColors: hslAnchorColors.slice(0, numPoints), numPoints: numPoints });
      setDictionaryPalette(gen.colors);
    }
  };

  useEffect(() => {
    if (colorCombos.length > 0) {
      generateDictionaryPalette();
    }
  }, [colorCombos, numPoints]);

  useEffect(() => {
    if (!reduceMotion) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }
  }, [reduceMotion, pulse]);

  const handleSaveDictionaryPalette = () => {
    const newPalette = {
      name: `Dictionary Palette ${new Date().toLocaleTimeString()}`,
      colors: dictionaryPalette,
    };
    savePalette(newPalette);
    Alert.alert('Palette Saved!', 'Your new palette has been saved to your collection.');
    loadPalettes(); // Reload list
  };

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

  const ListHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Library</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Resources & Collection</Text>
      </View>

      {/* Dictionary Section */}
      <View style={[styles.section, { borderColor: theme.gridLine }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Color Dictionary</Text>
          <Text style={[styles.inspiration, { color: theme.subtext }]}>(Sanzo Wada)</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.gridLine }]}>
          <View style={styles.swatchRow}>
            {dictionaryPalette.map((hsl, i) => (
              <AnimatedTile
                key={i}
                hsl={hsl}
                index={i}
                reduceMotion={reduceMotion}
                pulse={pulse}
                width={width}
              />
            ))}
          </View>

          <View style={styles.metaRow}>
            {dictionaryPalette.map((hsl, i) => {
              const bgColor = hslArrayToCss(hsl);
              const textColor = getContrastTextColor(hsl);
              return (
                <View key={i} style={[styles.metaItem, { backgroundColor: bgColor, borderRadius: 8, padding: 4 }]}>
                  <Text style={[styles.metaText, { color: textColor }]}>{hslToHex(hsl[0], hsl[1] * 100, hsl[2] * 100)}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={generateDictionaryPalette}
              style={[styles.actionButton, { borderWidth: 2, borderColor: theme.gridLine }]}
            >
              <Text style={[styles.actionText, { color: theme.text }]}>Randomize</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveDictionaryPalette}
              style={[styles.actionButton, { backgroundColor: theme.primary, borderWidth: 2, borderColor: theme.gridLine }]}
            >
              <Text style={[styles.actionText, { color: '#FFF' }]}>Save to Collection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.sectionHeader, { borderColor: theme.gridLine }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Saved Palettes</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={savedPalettes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
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
  header: { padding: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 36, fontFamily: 'PlayfairDisplay_700Bold', marginBottom: 8, letterSpacing: 0.5 },
  subtitle: { fontSize: 17, fontFamily: 'Inter_400Regular', opacity: 0.8 },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 2,
  },
  sectionHeader: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    opacity: 0.5
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 3,
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  inspiration: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    opacity: 0.65,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
    gap: 4,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 14,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default SavedScreen;
