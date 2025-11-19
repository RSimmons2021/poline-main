import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { GenerativeColorWheel } from '../components/GenerativeColorWheel';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [wheelStyle, setWheelStyle] = useState<'default' | 'dark' | 'blur' | 'notches' | 'trans'>('default');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Explore Palettes</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Discover color through generative art</Text>
      </View>

      <View style={styles.content}>
        {/* Generative Color Wheel - Main Centerpiece */}
        <View style={[styles.centerpieceCard, { backgroundColor: theme.background, borderColor: theme.gridLine }]}>
          <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 16, textAlign: 'center' }]}>
            Generative Color Wheel
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.subtext, marginBottom: 20, textAlign: 'center' }]}>
            Tap to regenerate • Inspired by Copic Color Wheel
          </Text>

          <View style={styles.wheelCenterpiece}>
            <GenerativeColorWheel
              style={wheelStyle}
              size={Math.min(width * 0.85, 350)}
            />
          </View>

          {/* Wheel Style Dropdown/Selector */}
          <View style={styles.styleSelector}>
            <Text style={[styles.styleSelectorLabel, { color: theme.text }]}>Wheel Style</Text>
            <View style={styles.styleButtons}>
              {(['default', 'dark', 'blur', 'notches', 'trans'] as const).map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.styleButton,
                    {
                      backgroundColor: wheelStyle === style ? theme.primary : theme.card,
                      borderWidth: 2,
                      borderColor: theme.gridLine
                    }
                  ]}
                  onPress={() => setWheelStyle(style)}
                >
                  <Text style={[
                    styles.styleButtonText,
                    { color: wheelStyle === style ? '#FFF' : theme.text }
                  ]}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  centerpieceCard: {
    borderRadius: 24,
    padding: 32,
    marginVertical: 20,
    marginBottom: 32,
    borderWidth: 4,
    shadowColor: '#1A1714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    marginTop: 6,
    lineHeight: 22,
    opacity: 0.75,
  },
  wheelCenterpiece: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginBottom: 28,
  },
  styleSelector: {
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: 'rgba(26, 23, 20, 0.1)',
  },
  styleSelectorLabel: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  styleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  styleButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    minWidth: 90,
  },
  styleButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default ExploreScreen;