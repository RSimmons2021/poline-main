import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { Poline } from 'poline';
import RoomMockup from '../components/RoomMockup';
import AnchorEditor from '../components/AnchorEditor';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import { getMaterialSuggestion, getContrastTextColor } from '../utils/colors';
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

  return (
    <ScrollView key={localNumPoints} style={[styles.container, { backgroundColor: theme.background }]}>
      <AnimatedLinearGradient
        animatedProps={animatedGradientProps}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Interior Design</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Palettes for your home</Text>
      </View>
      <View style={styles.content}>
        {/* Palette Size Control */}
        <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
          <View style={[styles.cardInner, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Palette Size: {localNumPoints} colors</Text>
            <Slider
              style={styles.slider}
              minimumValue={3}
              maximumValue={10}
              step={1}
              value={localNumPoints}
              onValueChange={setLocalNumPoints}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.subtext}
              thumbTintColor={theme.primary}
            />
          </View>
        </BlurView>

        {/* Preset Styles */}
        <View style={styles.presetContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={[styles.presetButton, { backgroundColor: theme.card }]}
              onPress={() => handlePresetSelect(preset)}
            >
              <Text style={[styles.presetButtonText, { color: theme.text }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Wheel Visualization */}
        {polineInstance && (
          <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
            <View style={[styles.cardInner, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 12 }]}>Color Wheel</Text>
              <View style={styles.wheelContainer}>
                <PolineColorWheel
                  poline={polineInstance}
                  size={280}
                  showPaletteColors={true}
                  reduceMotion={reduceMotion}
                />
              </View>
            </View>
          </BlurView>
        )}

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
              {palette.map((hsl, i) => {
                const bgColor = hslArrayToCss(hsl);
                const textColor = getContrastTextColor(hsl);
                return (
                  <View key={i} style={[styles.metaItem, { backgroundColor: bgColor, borderRadius: 8, padding: 4 }]}>
                    <Text style={[styles.metaText, { color: textColor }]}>{hslArrayToCss(hsl)}</Text>
                  </View>
                );
              })}
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
            style={[styles.actionButton, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Randomize</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSavePalette}
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
          >
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
  card: {
    borderRadius: 24,
    padding: 2,
    overflow: 'hidden',
    marginVertical: 12,
  },
  cardInner: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTitle: { fontSize: 18, fontFamily: 'Inter_400Regular', fontWeight: '600' },
  slider: { width: '100%', height: 40 },
  wheelContainer: { alignItems: 'center', justifyContent: 'center' },
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
  swatchTile: { flex: 1, height: 110, borderRadius: 12, marginHorizontal: 2, boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.35)' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, width: '100%' },
  metaItem: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
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
