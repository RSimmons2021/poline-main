import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Poline } from 'poline';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming, withRepeat, Easing, cancelAnimation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { savePalette } from '../utils/storage';
import { toProtanopia, toDeuteranopia } from '../utils/colorBlindness';
import { ThemeContext } from '../theme/ThemeContext';
import AnimatedTile from '../components/AnimatedTile';
import { PolineColorWheel } from '../components/PolineColorWheel';
import { getContrastTextColor } from '../utils/colors';

const { width } = Dimensions.get('window');

type SimulationType = 'none' | 'protanopia' | 'deuteranopia';

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ExploreScreen = () => {
  const { theme, isDark, reduceMotion, numPoints: globalNumPoints } = useContext(ThemeContext);
  const [localNumPoints, setLocalNumPoints] = useState(globalNumPoints);
  const [palette, setPalette] = useState<number[][]>([]);
  const [polineInstance, setPolineInstance] = useState<Poline | null>(null);
  const [simulation, setSimulation] = useState<SimulationType>('none');
  const pulse = useSharedValue(0);
  const animatedBackgroundColors = useSharedValue<string[]>(isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]);

  const generateRandomPalette = () => {
    const gen = new Poline({ numPoints: localNumPoints });
    setPalette(gen.colors);
    setPolineInstance(gen);
  };

  useEffect(() => {
    generateRandomPalette();
  }, [localNumPoints]); // Regenerate palette when localNumPoints changes

  useEffect(() => {
    if (!reduceMotion) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulse); // Stop animation if reduce motion is enabled
      pulse.value = 0; // Reset animation value
    }
  }, [reduceMotion, pulse]); // Re-run effect when reduceMotion or pulse changes

  useEffect(() => {
    if (palette.length > 0) {
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
    const newPalette = {
      name: `Palette ${new Date().toLocaleTimeString()}`,
      colors: palette,
    };
    savePalette(newPalette);
    Alert.alert('Palette Saved!', 'Your new palette has been saved to your collection.');
  };

  const getSimulatedPalette = () => {
    if (simulation === 'protanopia') {
      return palette.map(toProtanopia);
    }
    if (simulation === 'deuteranopia') {
      return palette.map(toDeuteranopia);
    }
    return palette;
  };

  const simulatedPalette = getSimulatedPalette();

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
        <Text style={[styles.title, { color: theme.text }]}>Explore Palettes</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Discover new color combinations</Text>
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

        {/* Generated Palette */}
        <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.card}>
          <View style={[styles.cardInner, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Generated Palette</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={generateRandomPalette}
                  style={styles.actionButton}
                >
                  <Text style={[styles.actionText, { color: theme.text }]}>Randomize</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSavePalette}
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.actionText, { color: theme.text }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.swatchRow}>
              {simulatedPalette.map((hsl, i) => (
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
              {simulatedPalette.map((hsl, i) => {
                const bgColor = hslArrayToCss(hsl);
                const textColor = getContrastTextColor(hsl);
                return (
                  <View key={i} style={[styles.metaItem, { backgroundColor: bgColor, borderRadius: 8, padding: 4 }]}>
                    <Text style={[styles.metaText, { color: textColor }]}>{hslArrayToCss(hsl)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </BlurView>

        {/* Color Blindness Simulator */}
        <View style={styles.simulatorContainer}>
          <Text style={[styles.simulatorTitle, { color: theme.text }]}>Color Blindness Simulator</Text>
          <View style={styles.simulatorButtons}>
            <TouchableOpacity
              style={[styles.simulatorButton, simulation === 'none' && { backgroundColor: theme.primary }]}
              onPress={() => setSimulation('none')}
            >
              <Text style={[styles.actionText, { color: theme.text }]}>None</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.simulatorButton, simulation === 'protanopia' && { backgroundColor: theme.primary }]}
              onPress={() => setSimulation('protanopia')}
            >
              <Text style={[styles.actionText, { color: theme.text }]}>Protanopia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.simulatorButton, simulation === 'deuteranopia' && { backgroundColor: theme.primary }]}
              onPress={() => setSimulation('deuteranopia')}
            >
              <Text style={[styles.actionText, { color: theme.text }]}>Deuteranopia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48 },
  title: { fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', paddingBottom: 40 },
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
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontFamily: 'Inter_400Regular', fontWeight: '600' },
  actionsContainer: { flexDirection: 'row' },
  actionButton: { backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginLeft: 10 },
  actionText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  swatchRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  metaItem: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  metaText: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  slider: { width: '100%', height: 40 },
  wheelContainer: { alignItems: 'center', justifyContent: 'center' },
  simulatorContainer: {
    marginTop: 20,
  },
  simulatorTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  simulatorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  simulatorButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});

export default ExploreScreen;