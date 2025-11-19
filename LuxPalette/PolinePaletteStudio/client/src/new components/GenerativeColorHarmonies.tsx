import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// HUSL color space utilities (simplified)
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h = h / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(hue2rgb(h + 1 / 3) * 255),
    Math.round(hue2rgb(h) * 255),
    Math.round(hue2rgb(h - 1 / 3) * 255)
  ];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomColors = (total: number): string[] => {
  const colors: string[] = [];
  const part = Math.floor(total / 4);
  const reminder = total % 4;

  const baseHue = random(0, 360);
  const hues = [0, 60, 120, 180, 240, 300].map(offset => (baseHue + offset) % 360);

  const baseSaturation = random(5, 40) / 100;
  const baseLightness = random(0, 20) / 100;
  const rangeLightness = 0.9 - baseLightness;

  // Low saturated base color
  colors.push(rgbToHex(...hslToRgb(hues[0], baseSaturation, baseLightness * random(25, 75) / 100)));

  for (let i = 0; i < (part - 1); i++) {
    const lightness = baseLightness + (rangeLightness * Math.pow(i / (part - 1), 1.5));
    colors.push(rgbToHex(...hslToRgb(hues[0], baseSaturation, lightness)));
  }

  // Random shades
  const minSat = random(50, 70) / 100;
  const maxSat = (minSat * 100 + 30) / 100;
  const minLight = random(45, 80) / 100;
  const maxLight = Math.min(minLight + 0.4, 0.95);

  for (let i = 0; i < (part + reminder - 1); i++) {
    colors.push(
      rgbToHex(...hslToRgb(
        hues[random(0, hues.length - 1)],
        random(minSat * 100, maxSat * 100) / 100,
        random(minLight * 100, maxLight * 100) / 100
      ))
    );
  }

  colors.push(rgbToHex(...hslToRgb(hues[0], baseSaturation, rangeLightness)));

  return colors;
};

const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

interface GenerativeColorHarmoniesProps {
  amount?: number;
  onColorsGenerated?: (colors: string[]) => void;
}

export const GenerativeColorHarmonies: React.FC<GenerativeColorHarmoniesProps> = ({
  amount = 6,
  onColorsGenerated
}) => {
  const [colors, setColors] = useState<string[]>([]);
  const backgroundOpacity = useSharedValue(0);

  const generateColors = () => {
    const newColors = generateRandomColors(amount);
    setColors(newColors);

    if (onColorsGenerated) {
      onColorsGenerated(newColors);
    }

    // Animate background
    backgroundOpacity.value = 0;
    backgroundOpacity.value = withTiming(1, { duration: 1000 });
  };

  useEffect(() => {
    generateColors();
  }, [amount]);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  const gradientColors = colors.length > 0 ? colors : ['#F5F1E8', '#F5F1E8'];

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={colors.map((_, i) => i / (colors.length - 1))}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Color Swatches */}
      <View style={styles.colorsContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={generateColors}>
          <Svg width={23} height={23} viewBox="0 0 23 23">
            <Path
              d="M 12.109896,2.9653518 C 10.830826,2.9134678 9.5257058,3.132602 8.2817758,3.648946 c -3.9806,1.652399 -6.2540499,5.897846 -5.4179699,10.123046 0.8360799,4.2253 4.5540699,7.274132 8.8613301,7.269532 a 0.9995584,1.0006417 14.999899 1 0 0,-2 c -3.3667302,0 -6.2475202,-2.360557 -6.9004002,-5.660157 -0.65294,-3.2997 1.11025,-6.592765 4.22266,-7.884765 3.1124002,-1.292 6.6825102,-0.213669 8.5488302,2.582031 1.85391,2.77709 1.49946,6.460477 -0.8418,8.845703 l 0.0781,-2.365234 a 1.0001,1.0001 0 0 0 -0.98242,-1.046875 1.0001,1.0001 0 0 0 -1.01758,0.982422 l -0.15235,4.59375 a 1.0001,1.0001 0 0 0 1.03321,1.033203 l 4.5957,-0.152344 a 1.0001,1.0001 0 1 0 -0.0664,-1.998047 l -1.79492,0.06055 c 2.74739,-3.056097 3.10892,-7.618693 0.80859,-11.064453 -1.64326,-2.461525 -4.33252,-3.887808 -7.14648,-4.0019532 z"
              fill={colors[colors.length - 1] || '#000000'}
            />
          </Svg>
        </TouchableOpacity>

        {colors.map((color, index) => {
          const contrastColor = getContrastColor(color);
          return (
            <View
              key={index}
              style={[styles.colorBlock, { backgroundColor: color }]}
            >
              <Text style={[styles.colorLabel, { color: contrastColor }]}>
                {color.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  colorsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  colorBlock: {
    width: '90%',
    height: 80,
    marginVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
  },
});
