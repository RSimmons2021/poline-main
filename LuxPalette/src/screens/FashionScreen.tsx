import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { Poline } from 'poline';
import SwatchStrip from '../components/SwatchStrip';
import OutfitPair from '../components/OutfitPair';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import { PolineColorWheel } from '../components/PolineColorWheel';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming } from 'react-native-reanimated';

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
  const { theme, isDark, numPoints: globalNumPoints, reduceMotion } = useContext(ThemeContext);
  const [localNumPoints, setLocalNumPoints] = useState(globalNumPoints);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [polineInstance, setPolineInstance] = useState<Poline | null>(null);
  const [anchorColors, setAnchorColors] = useState<number[][]>(presets[0].config.anchorColors);
  const [textureType, setTextureType] = useState<TextureType>('none');
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (config: any) => {
    const gen = new Poline({ ...config, numPoints: localNumPoints });
    setPalette(gen.colors);
    setPolineInstance(gen);
    if (config.anchorColors) {
      setAnchorColors(config.anchorColors);
    }
  };

  const generateRandomPalette = () => {
    // Generate random palette while maintaining theme (similar saturation/lightness range)
    const randomAnchors = anchorColors.map((anchor) => {
      const randomHue = Math.random() * 360;
      return [randomHue, anchor[1] + (Math.random() - 0.5) * 0.2, anchor[2] + (Math.random() - 0.5) * 0.2];
    });
    const gen = new Poline({ anchorColors: randomAnchors, numPoints: localNumPoints });
    setPalette(gen.colors);
    setPolineInstance(gen);
    setAnchorColors(randomAnchors);
  };

  useEffect(() => {
    // Generate initial palette based on the first preset and current numPoints
    generatePalette(presets[0].config);
  }, [localNumPoints]); // Regenerate palette when localNumPoints changes

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
        <Text style={[styles.title, { color: theme.text }]}>Fashion & Clothing</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Palettes for your wardrobe</Text>
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
              onPress={() => generatePalette(preset.config)}
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
            <SwatchStrip palette={palette} textureType={textureType} />
            <View style={styles.textureSelectorContainer}>
              <Text style={[styles.textureSelectorTitle, { color: theme.text }]}>Fabric Texture</Text>
              <View style={styles.textureButtons}>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'none' && { backgroundColor: theme.primary }]}
                  onPress={() => setTextureType('none')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>None</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'lines' && { backgroundColor: theme.primary }]}
                  onPress={() => setTextureType('lines')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>Lines</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textureButton, textureType === 'dots' && { backgroundColor: theme.primary }]}
                  onPress={() => setTextureType('dots')}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>Dots</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.outfitPairsContainer}>
              <Text style={[styles.pairsTitle, { color: theme.text }]}>Outfit Pair Suggestions</Text>
              <OutfitPair color1={palette[0]} color2={palette[1]} />
              <OutfitPair color1={palette[0]} color2={palette[2]} />
              {palette.length > 3 && <OutfitPair color1={palette[1]} color2={palette[3]} />}
            </View>
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