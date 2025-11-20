import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getContrastTextColor, hslToRgb } from '../lib/colors';

function hexToHsl(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

interface ColorCombo {
  key: string;
  name: string;
  colors: string[];
}

const ColorCombos = () => {
  const [colorCombos, setColorCombos] = useState<ColorCombo[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json')
      .then(response => response.json())
      .then((data: any) => {
        const combos: ColorCombo[] = [];
        data.forEach((color: any) => {
          if (color.combinations) {
            color.combinations.forEach((comboIndex: number) => {
              const comboColor = data[comboIndex];
              if (comboColor) {
                // Create a unique key for the combination to avoid duplicates
                const comboKey = [color.hex, comboColor.hex].sort().join('-');
                if (!combos.some((c: ColorCombo) => c.key === comboKey)) {
                  combos.push({
                    key: comboKey,
                    name: `${color.name} & ${comboColor.name}`,
                    colors: [color.hex, comboColor.hex]
                  });
                }
              }
            });
          }
        });
        setColorCombos(combos);
      });
  }, []);

  const renderItem = ({ item }: { item: ColorCombo }) => {
    return (
      <View style={styles.comboContainer}>
        <Text style={styles.comboName}>{item.name}</Text>
        <View style={styles.colorBlocksContainer}>
          {item.colors.map((color, index) => {
            // Use local contrast calculation
            const hsl = hexToHsl(color);
            const contrastColor = hsl[2] > 0.5 ? '#000000' : '#FFFFFF';

            return (
              <View key={index} style={styles.colorBlockWrapper}>
                <View style={[styles.colorBlock, { backgroundColor: color }]}>
                  <Text style={[styles.hexCode, { color: contrastColor }]}>
                    {color.toUpperCase()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Combinations</Text>
      <FlatList
        data={colorCombos}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  comboContainer: {
    marginRight: 16,
    width: 140,
  },
  comboName: {
    fontSize: 11,
    marginBottom: 8,
    fontWeight: '500',
    color: '#666',
  },
  colorBlocksContainer: {
    gap: 8,
  },
  colorBlockWrapper: {
    marginBottom: 4,
  },
  colorBlock: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  hexCode: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default ColorCombos;
