import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hslToRgb, getContrastRatio } from '../utils/colors';
import { ThemeContext } from '../theme/ThemeContext';

interface OutfitPairProps {
  color1: number[];
  color2: number[];
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const OutfitPair: React.FC<OutfitPairProps> = ({ color1, color2 }) => {
  const { theme } = useContext(ThemeContext);
  const rgb1 = hslToRgb(color1[0], color1[1], color1[2]);
  const rgb2 = hslToRgb(color2[0], color2[1], color2[2]);
  const contrastRatio = getContrastRatio(rgb1, rgb2);

  return (
    <View style={styles.container}>
      <View style={[styles.colorBlock, { backgroundColor: hslArrayToCss(color1) }]} />
      <View style={[styles.colorBlock, { backgroundColor: hslArrayToCss(color2) }]} />
      <View style={styles.contrastContainer}>
        <Text style={[styles.contrastText, { color: theme.text }]}>
          Contrast Ratio: {contrastRatio.toFixed(2)}
        </Text>
        <Text style={[styles.contrastRating, { color: theme.subtext }]}>
          {contrastRatio >= 4.5 ? 'Good' : 'Poor'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBlock: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  contrastContainer: {
    marginLeft: 20,
  },
  contrastText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  contrastRating: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
});

export default OutfitPair;