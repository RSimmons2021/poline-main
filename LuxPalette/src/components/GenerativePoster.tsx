import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SimplexNoiseGenerator {
  noise2D: (x: number, y: number) => number;
}

// Simple noise generator (simplified version)
const createSimplexNoise = (seed: number): SimplexNoiseGenerator => {
  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
  ];

  const p = [];
  for (let i = 0; i < 256; i++) {
    p[i] = Math.floor(Math.random() * 256);
  }

  const perm = [];
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
  }

  return {
    noise2D: (xin: number, yin: number): number => {
      // Simplified 2D noise
      const x = Math.floor(xin);
      const y = Math.floor(yin);
      const fx = xin - x;
      const fy = yin - y;

      const u = fx * fx * (3 - 2 * fx);
      const v = fy * fy * (3 - 2 * fy);

      const a = perm[(x & 255) + perm[(y & 255)]] / 255;
      const b = perm[((x + 1) & 255) + perm[(y & 255)]] / 255;
      const c = perm[(x & 255) + perm[((y + 1) & 255)]] / 255;
      const d = perm[((x + 1) & 255) + perm[((y + 1) & 255)]] / 255;

      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    }
  };
};

interface GenerativePosterProps {
  width?: number;
  height?: number;
  colors?: string[];
  animate?: boolean;
}

export const GenerativePoster: React.FC<GenerativePosterProps> = ({
  width = SCREEN_WIDTH * 0.7,
  height = SCREEN_HEIGHT,
  colors = [
    '#72ffd7', '#8af4cd', '#9ce9c3', '#aaddb9', '#b6d2af', '#c1c6a5',
    '#cabb9c', '#d1af92', '#d8a289', '#dd9580', '#e28877', '#e67a6e',
    '#ea6b65', '#ed5b5c', '#ef4754', '#e93950', '#da3551', '#cc3051',
    '#bd2c52', '#af2852', '#a12452', '#932152', '#841d52', '#761a52',
    '#681652', '#5a1452', '#4b1151', '#3b0e51', '#290d51', '#0f0b50'
  ],
  animate = false
}) => {
  const [steps, setSteps] = useState(800);
  const [noise] = useState(() => createSimplexNoise(3.13));
  const [noisePos, setNoisePos] = useState(5.8);
  const [cosValue, setCosValue] = useState(3.1);
  const [cosStart, setCosStart] = useState(6);
  const [radius, setRadius] = useState(0.09);
  const [radiusVariation, setRadiusVariation] = useState(0.41);
  const [gradientStopPos, setGradientStopPos] = useState(3);
  const [gradientStartPos, setGradientStartPos] = useState(1);
  const [gradientOffset, setGradientOffset] = useState(1.1);
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');
  const [bg, setBg] = useState(29);
  const [circles, setCircles] = useState<any[]>([]);

  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      animationProgress.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [animate]);

  const generateCircles = () => {
    const newCircles = [];

    for (let i = 0; i < steps; i++) {
      const x = (width * 0.5) + (width * 0.3) * Math.cos(cosStart + (2 * Math.PI) * i * cosValue / steps);
      const y = (height * 0.05) + (height * (i / steps)) * 0.8;

      const colorIndex = Math.floor((i / steps) * (colors.length - 1));
      const color = colors[colorIndex];

      const circleRadius = Math.max(
        1,
        Math.abs((width * radius) + noise.noise2D(noisePos, i / steps) * width * radiusVariation)
      );

      const offsetX = noise.noise2D(i / steps, noisePos) * 75;
      const offsetY = noise.noise2D(noisePos, i / steps) * 150;

      newCircles.push({
        x: x + offsetX,
        y: y + offsetY,
        radius: circleRadius,
        color,
        index: i
      });
    }

    setCircles(newCircles);
  };

  useEffect(() => {
    generateCircles();
  }, [steps, noisePos, cosValue, cosStart, radius, radiusVariation, colors, bg]);

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        setNoisePos(prev => prev + 0.001);
        setCosStart(prev => prev + 0.05);
      }, 16);

      return () => clearInterval(interval);
    }
  }, [animate]);

  const handlePress = () => {
    // Randomize settings
    setSteps(Math.floor(Math.random() * 1395) + 5);
    setNoisePos(Math.random() * 10);
    setCosValue(Math.random() * 8.5 + 0.5);
    setCosStart(Math.random() * 8.5 + 0.5);
    setRadius(Math.random() * 0.499 + 0.001);
    setRadiusVariation(Math.random() * 0.499 + 0.001);
    setBg(Math.floor(Math.random() * colors.length));
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={colors[bg]}
        />

        {/* Draw circles */}
        <G opacity={0.8}>
          {circles.map((circle, index) => (
            <Circle
              key={index}
              cx={circle.x}
              cy={circle.y}
              r={circle.radius}
              fill={circle.color}
            />
          ))}
        </G>
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
