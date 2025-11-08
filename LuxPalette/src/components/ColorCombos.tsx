import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getContrastTextColor, hslToRgb } from '../utils/colors';

function hexToHsl(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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

const ColorCombos = () => {
  const [colorCombos, setColorCombos] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json')
      .then(response => response.json())
      .then(data => {
        const combos = [];
        data.forEach(color => {
          if (color.combinations) {
            color.combinations.forEach(comboIndex => {
              const comboColor = data[comboIndex];
              if (comboColor) {
                // Create a unique key for the combination to avoid duplicates
                const comboKey = [color.hex, comboColor.hex].sort().join('-');
                if (!combos.some(c => c.key === comboKey)) {
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

  const renderItem = ({ item }) => {
    const firstColorHex = item.colors[0];
    const firstColorHsl = hexToHsl(firstColorHex);
    const textColor = getContrastTextColor(firstColorHsl);

    return (
      <View style={styles.comboContainer}>
        <Text style={[styles.comboName, { color: '#FFFFFF' }]}>{item.name}</Text>
        <View style={styles.colorBlocksContainer}>
          {item.colors.map((color, index) => (
            <View key={index} style={[styles.colorBlock, { backgroundColor: color }]} />
          ))}
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
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 10,
  },
  comboContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  comboName: {
    fontSize: 12,
    marginBottom: 5,
  },
  colorBlocksContainer: {
    flexDirection: 'row',
  },
  colorBlock: {
    width: 50,
    height: 50,
  },
});

export default ColorCombos;
