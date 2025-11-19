import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Poline } from 'poline';
import CanvasPreview from '../components/CanvasPreview';
import { GenerativePoster } from '../components/GenerativePoster';
import Slider from '@react-native-community/slider';
import { mixHslColors } from '../utils/colors';
import { savePalette } from '../utils/storage';
import { ThemeContext } from '../theme/ThemeContext';
import { PolineColorWheel } from '../components/PolineColorWheel';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming } from 'react-native-reanimated';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const { theme, isDark, numPoints: globalNumPoints, reduceMotion } = useContext(ThemeContext);
  const [localNumPoints, setLocalNumPoints] = useState(globalNumPoints);
  const [basePalette, setBasePalette] = useState<number[][] | null>(null);
  const [blendedPalette, setBlendedPalette] = useState<number[][] | null>(null);
  const [polineInstance, setPolineInstance] = useState<Poline | null>(null);
  const [anchorColors, setAnchorColors] = useState<number[][]>(presets[0].config.anchorColors);
  const [blendRatio, setBlendRatio] = useState(0);
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generatePalette = (config: any) => {
    const gen = new Poline({ ...config, numPoints: localNumPoints });
    setBasePalette(gen.colors);
    setPolineInstance(gen);
    if (config.anchorColors) {
      setAnchorColors(config.anchorColors);
    }
  };

  const generateRandomPalette = () => {
    // Generate random palette while maintaining theme
    const randomAnchors = anchorColors.map((anchor) => {
      const randomHue = Math.random() * 360;
      return [randomHue, anchor[1] + (Math.random() - 0.5) * 0.2, anchor[2] + (Math.random() - 0.5) * 0.2];
    });
    const gen = new Poline({ anchorColors: randomAnchors, numPoints: localNumPoints });
    setBasePalette(gen.colors);
    setPolineInstance(gen);
    setAnchorColors(randomAnchors);
  };

  useEffect(() => {
    // Generate initial palette based on the first preset and current numPoints
    generatePalette(presets[0].config);
  }, [localNumPoints]); // Regenerate palette when localNumPoints changes

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

  const animatedGradientProps = useAnimatedProps(() => {
    return {
      colors: animatedBackgroundColors.value,
    };
  });

  const [posterColors, setPosterColors] = useState<string[]>([]);
  const [animatePoster, setAnimatePoster] = useState(false);

  useEffect(() => {
    if (blendedPalette) {
      const colors = blendedPalette.map(hsl =>
        `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
      );
      setPosterColors(colors);
    }
  }, [blendedPalette]);

  return (
    <View style={styles.container}>
      {/* Generative Poster Background - Full Screen */}
      <View style={StyleSheet.absoluteFill}>
        <GenerativePoster
          width={width}
          height={SCREEN_HEIGHT}
          colors={posterColors.length > 0 ? posterColors : undefined}
          animate={animatePoster}
        />
      </View>

      {/* Overlay Content with Blur */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.title, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }]}>
            Painting & Art
          </Text>
          <Text style={[styles.subtitle, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }]}>
            Generative poster as your canvas
          </Text>
        </View>

        <View style={styles.content}>
          {/* Animation Toggle */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <TouchableOpacity
                onPress={() => setAnimatePoster(!animatePoster)}
                style={[styles.toggleButton, { backgroundColor: animatePoster ? theme.primary : 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: theme.gridLine }]}
              >
                <Text style={[styles.toggleButtonText, { color: '#FFF' }]}>
                  {animatePoster ? 'Stop Animation' : 'Start Animation'}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Preset Styles */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={[styles.cardTitle, { color: '#FFF', marginBottom: 12 }]}>Painting Styles</Text>
              <View style={styles.presetContainer}>
                {presets.map((preset) => (
                  <TouchableOpacity
                    key={preset.name}
                    style={[styles.presetButton, { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: theme.gridLine }]}
                    onPress={() => generatePalette(preset.config)}
                  >
                    <Text style={[styles.presetButtonText, { color: '#FFF' }]}>{preset.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>

          {/* Palette Size Control */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={[styles.cardTitle, { color: '#FFF' }]}>Palette Size: {localNumPoints} colors</Text>
              <Slider
                style={styles.sliderStyle}
                minimumValue={3}
                maximumValue={10}
                step={1}
                value={localNumPoints}
                onValueChange={setLocalNumPoints}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={theme.primary}
              />
            </View>
          </BlurView>

          {/* Blend Control */}
          <BlurView intensity={80} tint="dark" style={[styles.card, { borderWidth: 2, borderColor: theme.gridLine }]}>
            <View style={[styles.cardInner, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Text style={[styles.sliderLabel, { color: '#FFF' }]}>Blend: {Math.round(blendRatio * 100)}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={blendRatio}
                onValueChange={setBlendRatio}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={theme.primary}
              />
            </View>
          </BlurView>

          {/* Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              onPress={generateRandomPalette}
              style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: theme.gridLine }]}
            >
              <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Randomize</Text>
            </TouchableOpacity>
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
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
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
  sliderStyle: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  wheelContainer: { alignItems: 'center', justifyContent: 'center' },
  toggleButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
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
  sliderContainer: {
    marginTop: 24,
  },
  sliderLabel: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  slider: {
    width: '100%',
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 16,
  },
  actionButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default PaintingScreen;
