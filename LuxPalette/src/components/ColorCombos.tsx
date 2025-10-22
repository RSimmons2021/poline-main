import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ColorCombos = () => {
  const [colorCombos, setColorCombos] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json')
      .then(response => response.json())
      .then(data => {
        const combos = data.reduce((acc, color) => {
          if (color.combinations) {
            color.combinations.forEach(comboIndex => {
              const combo = data[comboIndex];
              if (combo) {
                const existingCombo = acc.find(c => c.colors.includes(color.hex) && c.colors.includes(combo.hex));
                if (!existingCombo) {
                  acc.push({ colors: [color.hex, combo.hex] });
                }
              }
            });
          }
          return acc;
        }, []);
        setColorCombos(combos);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.comboContainer}>
      {item.colors.map((color, index) => (
        <View key={index} style={[styles.colorBlock, { backgroundColor: color }]} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Combinations</Text>
      <FlatList
        data={colorCombos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    flexDirection: 'row',
    marginRight: 10,
  },
  colorBlock: {
    width: 50,
    height: 50,
  },
});

export default ColorCombos;
