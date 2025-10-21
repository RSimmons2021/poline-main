import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing, cancelAnimation } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface AnimatedTileProps {
  hsl: number[];
  index: number;
  reduceMotion: boolean;
  pulse: Animated.SharedValue<number>;
  width: number;
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const AnimatedTile: React.FC<AnimatedTileProps> = ({ hsl, index, reduceMotion, pulse, width }) => {
  const AnimatedTileStyle = useAnimatedStyle(() => {
    const t = (pulse.value + index * 0.12) % 1;
    const translateY = reduceMotion ? 0 : (Math.sin(t * Math.PI * 2) * 6);
    const scale = reduceMotion ? 1 : (1 + Math.sin(t * Math.PI * 2) * 0.01);
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const css = hslArrayToCss(hsl);

  return (
    <Animated.View key={index} style={[styles.swatchTile, AnimatedTileStyle, { backgroundColor: css, width: (width - 80) / 5 }]} />
  );
};

const styles = StyleSheet.create({
  swatchTile: {
    height: 110,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
});

export default AnimatedTile;
