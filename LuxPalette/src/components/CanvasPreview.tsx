import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CanvasPreviewProps {
  palette: number[][];
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ palette }) => {
  if (!palette || palette.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Svg height="200" width="300">
        {palette.map((hsl, i) => {
          const css = hslArrayToCss(hsl);
          const cx = 50 + (i * 50);
          const cy = 100;
          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r="40"
              fill={css}
              opacity="0.8"
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default CanvasPreview;
