import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { Poline } from 'poline';
import RoomMockup from '../components/RoomMockup';
import AnchorEditor from '../components/AnchorEditor';
import { GenerativeColorHarmonies } from '../components/GenerativeColorHarmonies';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import { getMaterialSuggestion, getContrastTextColor, hslToHex, rgbToHsl } from '../utils/colors';
import { PolineColorWheel } from '../components/PolineColorWheel';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming } from 'react-native-reanimated';

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
  const { theme, isDark, numPoints: globalNumPoints, reduceMotion } = useContext(ThemeContext);
  const [localNumPoints, setLocalNumPoints] = useState(globalNumPoints);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [polineInstance, setPolineInstance] = useState<Poline | null>(null);
  const [anchorColors, setAnchorColors] = useState<number[][]>(presets[0].config.anchorColors);
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (anchors: number[][]) => {
    const gen = new Poline({ anchorColors: anchors, numPoints: localNumPoints });
    setPalette(gen.colors);
    setPolineInstance(gen);
  };

  const generateRandomPalette = () => {
    // Generate random palette while keeping the same theme (maintain anchor structure)
    const randomAnchors = anchorColors.map((anchor) => {
      // Randomize hue but keep similar saturation and lightness for theme consistency
      const randomHue = Math.random() * 360;
      return [randomHue, anchor[1] + (Math.random() - 0.5) * 0.2, anchor[2] + (Math.random() - 0.5) * 0.2];
    });
    setAnchorColors(randomAnchors);
  };

  useEffect(() => {
    generatePalette(anchorColors);
  }, [anchorColors, localNumPoints]); // Regenerate palette when localNumPoints changes

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

  const animatedGradientProps = useAnimatedProps(() => {
    return {
      colors: animatedBackgroundColors.value,
    };
  });

  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const [colorAmount, setColorAmount] = useState(6);

  const handleColorsGenerated = (colors: string[]) => {
    setGeneratedColors(colors);

    // Convert hex colors to HSL for palette
    const hslColors = colors.map(hexColor => {
      const r = parseInt(hexColor.slice(1, 3), 16) / 255;
      const g = parseInt(hexColor.slice(3, 5), 16) / 255;
      const b = parseInt(hexColor.slice(5, 7), 16) / 255;
      return rgbToHsl(r * 255, g * 255, b * 255);
    });

    setPalette(hslColors);
  };

  return (
    <View style={styles.fullContainer}>
      {/* Generative Color Harmonies - Full Background */}
      <View style={StyleSheet.absoluteFill}>
        <GenerativeColorHarmonies
          amount={colorAmount}
          onColorsGenerated={handleColorsGenerated}
        />
      </View>

      {/* Content Overlay */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.title, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }]}>
            Interior Design
          </Text>
          <Text style={[styles.subtitle, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }]}>
            Generative color harmonies for your space
          </Text>
        </View>

        <View style={styles.content}>
          {/* Color Amount Control */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={[styles.cardTitle, { color: '#FFF' }]}>Harmony Colors: {colorAmount}</Text>
              <Slider
                style={styles.slider}
                minimumValue={4}
                maximumValue={10}
                step={1}
                value={colorAmount}
                onSlidingComplete={setColorAmount}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={theme.primary}
              />
            </View>
          </BlurView>

          {/* Preset Styles */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={[styles.cardTitle, { color: '#FFF', marginBottom: 12 }]}>Interior Styles</Text>
              <View style={styles.presetContainer}>
                {presets.map((preset) => (
                  <TouchableOpacity
                    key={preset.name}
                    style={[styles.presetButton, { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: theme.gridLine }]}
                    onPress={() => handlePresetSelect(preset)}
                  >
                    <Text style={[styles.presetButtonText, { color: '#FFF' }]}>{preset.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>

          {/* Room Mockup */}
          {palette && palette.length > 0 && (
            <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
              <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                <Text style={[styles.cardTitle, { color: '#FFF', marginBottom: 12 }]}>Room Preview</Text>
                <RoomMockup palette={palette} />

                {materialSuggestion && (
                  <View style={[styles.materialSuggestionContainer, { backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 12 }]}>
                    <Text style={[styles.materialSuggestionText, { color: '#FFF' }]}>
                      Suggested Materials: {materialSuggestion}
                    </Text>
                  </View>
                )}
              </View>
            </BlurView>
          )}

          {/* Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              onPress={handleSavePalette}
              style={[styles.actionButton, { backgroundColor: theme.primary, borderWidth: 2, borderColor: theme.gridLine }]}
            >
              <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Save Palette</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  header: {
    padding: 28,
    paddingTop: 60,
    paddingBottom: 36,
  },
  title: {
    fontSize: 38,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24
  },
  card: {
    borderRadius: 20,
    padding: 3,
    overflow: 'hidden',
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardInner: {
    padding: 24,
    borderRadius: 17,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  wheelContainer: { alignItems: 'center', justifyContent: 'center' },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    minWidth: 100,
  },
  presetButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  paletteContainer: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
    gap: 4,
  },
  swatchTile: {
    flex: 1,
    height: 110,
    borderRadius: 14,
    marginHorizontal: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    width: '100%',
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
  materialSuggestionContainer: {
    padding: 16,
    borderRadius: 14,
  },
  materialSuggestionText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 24,
  },
  actionButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 220,
  },
  actionButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default InteriorScreen;
