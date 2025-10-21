import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Poline } from 'poline';
import SwatchStrip from '../components/SwatchStrip';
import OutfitPair from '../components/OutfitPair';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type TextureType = 'none' | 'lines' | 'dots';

const presets = [
  {
    name: 'Capsule',
    config: {
      anchorColors: [[20, 0.1, 0.2], [200, 0.1, 0.8], [30, 0.1, 0.5]],
    },
  },
  {
    name: 'Seasonal',
    config: {
      anchorColors: [[340, 0.8, 0.6], [20, 0.9, 0.7], [190, 0.7, 0.4]],
    },
  },
  {
    name: 'Streetwear',
    config: {
      anchorColors: [[0, 1, 0.5], [240, 1, 0.6], [120, 1, 0.5]],
    },
  },
];

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const FashionScreen = () => {
  const { theme, isDark, numPoints } = useContext(ThemeContext);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [textureType, setTextureType] = useState<TextureType>('none');
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (config: any) => {
    const gen = new Poline({ ...config, numPoints: numPoints });
    setPalette(gen.colors);
  };

  const generateRandomPalette = () => {
    const gen = new Poline({ numPoints: numPoints });
    setPalette(gen.colors);
  };

  useEffect(() => {
    // Generate initial palette based on the first preset and current numPoints
    generatePalette(presets[0].config);
  }, [numPoints]); // Regenerate palette when numPoints changes

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

  const handleSavePalette = () => {
    if (palette) {
      const newPalette = {
        name: `Fashion Palette ${new Date().toLocaleTimeString()}`,
        colors: palette,
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
        <Text style={[styles.title, { color: theme.text }]}>Fashion & Clothing</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Palettes for your wardrobe</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.presetContainer}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              style={[styles.presetButton, { backgroundColor: theme.card }]}              onPress={() => generatePalette(preset.config)}
            >
              <Text style={[styles.presetButtonText, { color: theme.text }]}>{preset.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {palette && (
          <View style={styles.paletteContainer}>
            <SwatchStrip palette={palette} textureType={textureType} />
            <View style={styles.textureSelectorContainer}>
              <Text style={[styles.textureSelectorTitle, { color: theme.text }]}>Fabric Texture</Text>
              <View style={styles.textureButtons}>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'none' && { backgroundColor: theme.primary }]}                  onPress={() => setTextureType('none')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>None</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'lines' && { backgroundColor: theme.primary }]}                  onPress={() => setTextureType('lines')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>Lines</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'dots' && { backgroundColor: theme.primary }]}                  onPress={() => setTextureType('dots')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>Dots</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.outfitPairsContainer}>
              <Text style={[styles.pairsTitle, { color: theme.text }]}>Outfit Pair Suggestions</Text>
              <OutfitPair color1={palette[0]} color2={palette[1]} />
              <OutfitPair color1={palette[0]} color2={palette[2]} />
              <OutfitPair color1={palette[1]} color2={palette[3]} />
            </View>
            <View style={styles.bottomActions}>
              <TouchableOpacity
                onPress={generateRandomPalette}
                style={[styles.actionButton, { backgroundColor: theme.card }]}              >
                <Text style={[styles.actionButtonText, { color: theme.text }]}>Randomize</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePalette}
                style={[styles.actionButton, { backgroundColor: theme.primary }]}              >
                <Text style={[styles.actionButtonText, { color: theme.text }]}>Save Palette</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  outfitPairsContainer: {
    marginTop: 30,
  },
  pairsTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 10,
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
  textureSelectorContainer: {
    marginTop: 20,
  },
  textureSelectorTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textureButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
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

export default FashionScreen;