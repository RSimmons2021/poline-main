import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import FabricTextureOverlay from './FabricTextureOverlay';

interface SwatchStripProps {
  palette: number[][];
  textureType: 'none' | 'lines' | 'dots';
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const SwatchStrip: React.FC<SwatchStripProps> = ({ palette, textureType }) => {
  const { theme } = useContext(ThemeContext);

  if (!palette || palette.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {palette.map((hsl, i) => {
        const css = hslArrayToCss(hsl);
        return (
          <View key={i} style={styles.swatch}>
            <FabricTextureOverlay color={css} textureType={textureType} />
            <Text style={[styles.swatchText, { color: theme.text }]}>{css}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  swatch: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textShadow: '1px 1px 10px rgba(0, 0, 0, 0.35)',
  },
});

export default SwatchStrip;
