import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Poline } from 'poline';
import RoomMockup from '../components/RoomMockup';
import AnchorEditor from '../components/AnchorEditor';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import { getMaterialSuggestion } from '../utils/colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const presets = [
  {
    name: 'Monochrome',
    config: {
      anchorColors: [[0, 0, 0.1], [0, 0, 0.9]],
    },
  },
  {
    name: 'Minimal',
    config: {
      anchorColors: [[20, 0.1, 0.8], [200, 0.1, 0.3]],
    },
  },
  {
    name: 'Scandinavian',
    config: {
      anchorColors: [[200, 0.2, 0.9], [30, 0.3, 0.8], [0, 0, 0.2]],
    },
  },
  {
    name: 'Industrial',
    config: {
      anchorColors: [[0, 0, 0.2], [0, 0, 0.8], [20, 0.1, 0.3]],
    },
  },
];

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const InteriorScreen = () => {
  const { theme, isDark, numPoints } = useContext(ThemeContext);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [anchorColors, setAnchorColors] = useState<number[][]>(presets[0].config.anchorColors);
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (anchors: number[][]) => {
    const gen = new Poline({ anchorColors: anchors, numPoints: numPoints });
    setPalette(gen.colors);
  };

  const generateRandomPalette = () => {
    const gen = new Poline({ numPoints: numPoints });
    setPalette(gen.colors);
    // When randomizing, we should also update anchorColors to reflect the new random palette
    // For simplicity, we'll just use the first few colors as anchors if available
    setAnchorColors(gen.colors.slice(0, 3)); // Take first 3 colors as anchors
  };

  useEffect(() => {
    generatePalette(anchorColors);
  }, [anchorColors, numPoints]); // Regenerate palette when numPoints changes

  useEffect(() => {
    if (palette && palette.length > 0) {
      const newColors = [
        hslArrayToCss(palette[0]),
        hslArrayToCss(palette[Math.floor(palette.length / 2)]),
        hslArrayToCss(palette[palette.length - 1]),
      ];
      animatedBackgroundColors.value = withTiming(newColors, { duration: 1000 });
    } else {
      animatedBackgroundColors.value = withTiming(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background], { duration: 1000 });
    }
  }, [palette, isDark, theme.background]);

  const handleAnchorColorChange = (index: number, newColor: number[]) => {
    const newAnchorColors = [...anchorColors];
    newAnchorColors[index] = newColor;
    setAnchorColors(newAnchorColors);
  };

  const handlePresetSelect = (preset: any) => {
    setAnchorColors(preset.config.anchorColors);
  };

  const handleSavePalette = () => {
    if (palette) {
      const newPalette = {
        name: `Interior Palette ${new Date().toLocaleTimeString()}`,
        colors: palette,
      };
      savePalette(newPalette);
      Alert.alert('Palette Saved!', 'Your new palette has been saved to your collection.');
    }
  };

  const materialSuggestion = palette && palette.length > 0 ? getMaterialSuggestion(palette[0]) : '';

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      // This is a workaround as Animated.createAnimatedComponent(LinearGradient)
      // expects an array of colors directly. We'll pass the animated value.
      // The actual animation of colors array is handled by animatedBackgroundColors.value
    };
  });

  return (
    <ScrollView key={numPoints} style={[styles.container, { backgroundColor: theme.background }]}>
      <AnimatedLinearGradient
        colors={animatedBackgroundColors.value}
        style={[StyleSheet.absoluteFill, animatedGradientStyle]}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Interior Design</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Palettes for your home</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.presetContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={[styles.presetButton, { backgroundColor: theme.card }]}              onPress={() => handlePresetSelect(preset)}
            >
              <Text style={[styles.presetButtonText, { color: theme.text }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {palette && (
          <View style={styles.paletteContainer}>
            <RoomMockup palette={palette} />
            <View style={styles.swatchRow}>
              {palette.map((hsl, i) => {
                const css = hslArrayToCss(hsl);
                return (
                  <View key={i} style={[styles.swatchTile, { backgroundColor: css }]} />
                );
              })}
            </View>
            <View style={styles.metaRow}>
              {palette.map((hsl, i) => (
                <View key={i} style={styles.metaItem}>
                  <Text style={[styles.metaText, { color: theme.subtext }]}>{hslArrayToCss(hsl)}</Text>
                </View>
              ))}
            </View>
            {materialSuggestion && (
              <View style={[styles.materialSuggestionContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.materialSuggestionText, { color: theme.text }]}>
                  Suggested Materials: {materialSuggestion}
                </Text>
              </View>
            )}
          </View>
        )}

        <AnchorEditor anchorColors={anchorColors} onAnchorColorChange={handleAnchorColorChange} />
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={generateRandomPalette}
            style={[styles.actionButton, { backgroundColor: theme.card }]}          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Randomize</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSavePalette}
            style={[styles.actionButton, { backgroundColor: theme.primary }]}          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Save Palette</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48 },
  title: { fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', marginBottom: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  presetButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  paletteContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  swatchRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, width: '100%' },
  swatchTile: { width: (width - 80) / 5, height: 110, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, width: '100%' },
  metaItem: { width: (width - 80) / 5, alignItems: 'center' },
  metaText: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  materialSuggestionContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 12,
  },
  materialSuggestionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});

export default InteriorScreen;
