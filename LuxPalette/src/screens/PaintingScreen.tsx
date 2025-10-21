import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Poline } from 'poline';
import CanvasPreview from '../components/CanvasPreview';
import Slider from '@react-native-community/slider';
import { mixHslColors } from '../utils/colors';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const presets = [
  {
    name: 'High-contrast',
    config: {
      anchorColors: [[0, 1, 0.5], [180, 1, 0.5]],
    },
  },
  {
    name: 'Monochrome',
    config: {
      anchorColors: [[200, 0.8, 0.2], [200, 0.8, 0.9]],
    },
  },
  {
    name: 'Vibrant',
    config: {
      anchorColors: [[0, 1, 0.6], [120, 1, 0.6], [240, 1, 0.6]],
    },
  },
];

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const PaintingScreen = () => {
  const { theme, isDark, numPoints } = useContext(ThemeContext);
  const [basePalette, setBasePalette] = useState<number[][] | null>(null);
  const [blendedPalette, setBlendedPalette] = useState<number[][] | null>(null);
  const [blendRatio, setBlendRatio] = useState(0);
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (config: any) => {
    const gen = new Poline({ ...config, numPoints: numPoints });
    setBasePalette(gen.colors);
  };

  const generateRandomPalette = () => {
    const gen = new Poline({ numPoints: numPoints });
    setBasePalette(gen.colors);
  };

  useEffect(() => {
    // Generate initial palette based on the first preset and current numPoints
    generatePalette(presets[0].config);
  }, [numPoints]); // Regenerate palette when numPoints changes

  useEffect(() => {
    if (basePalette) {
      const newBlendedPalette = basePalette.map((color, index) => {
        if (index === basePalette.length - 1) {
          return color;
        }
        return mixHslColors(color, basePalette[index + 1], blendRatio);
      });
      setBlendedPalette(newBlendedPalette);
    }
  }, [basePalette, blendRatio]);

  useEffect(() => {
    if (blendedPalette && blendedPalette.length > 0) {
      const newColors = [
        hslArrayToCss(blendedPalette[0]),
        hslArrayToCss(blendedPalette[Math.floor(blendedPalette.length / 2)]),
        hslArrayToCss(blendedPalette[blendedPalette.length - 1]),
      ];
      animatedBackgroundColors.value = withTiming(newColors, { duration: 1000 });
    } else {
      animatedBackgroundColors.value = withTiming(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background], { duration: 1000 });
    }
  }, [blendedPalette, isDark, theme.background]);

  const handleSavePalette = () => {
    if (blendedPalette) {
      const newPalette = {
        name: `Painting Palette ${new Date().toLocaleTimeString()}`,
        colors: blendedPalette,
      };
      savePalette(newPalette);
      Alert.alert('Palette Saved!', 'Your new palette has been saved to your collection.');
    }
  };

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
        <Text style={[styles.title, { color: theme.text }]}>Painting & Art</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Palettes for your canvas</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.presetContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={[styles.presetButton, { backgroundColor: theme.card }]}>
              <Text style={[styles.presetButtonText, { color: theme.text }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {blendedPalette && (
          <View style={styles.paletteContainer}>
            <CanvasPreview palette={blendedPalette} />
          </View>
        )}

        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: theme.text }]}>Blend</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={blendRatio}
            onValueChange={setBlendRatio}
            thumbTintColor={theme.primary}
          />
        </View>
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
  },
  sliderContainer: {
    marginTop: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
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

export default PaintingScreen;
