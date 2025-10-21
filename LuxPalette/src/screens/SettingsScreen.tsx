import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../theme/ThemeContext';
import { getSettings, saveSettings } from '../utils/storage';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const { isDark, toggleTheme, theme, reduceMotion, setReduceMotion, numPoints, setNumPoints } = useContext(ThemeContext);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setReduceMotion(settings.reduceMotion);
      // numPoints is already loaded by ThemeProvider, but we need to ensure local state is in sync
      // setNumPoints(settings.numPoints); // This is handled by ThemeProvider
    };
    loadSettings();
  }, []);

  const handleReduceMotionToggle = async (value: boolean) => {
    setReduceMotion(value);
    // The saveSettings is already handled by ThemeProvider's setReduceMotion
  };

  const handleNumPointsChange = async (value: number) => {
    setNumPoints(value);
    // The saveSettings is already handled by ThemeProvider's setNumPoints
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ["#0f0f12", "#121216"] : [theme.background, theme.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Customize your experience</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={isDark ? theme.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: theme.text }]}>Reduce Motion</Text>
          <Switch
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={reduceMotion ? theme.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleReduceMotionToggle}
            value={reduceMotion}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, { color: theme.text }]}>Number of Colors: {numPoints}</Text>
          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={10}
            step={1}
            value={numPoints}
            onValueChange={handleNumPointsChange}
            thumbTintColor={theme.primary}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.subtext}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48 },
  title: { fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', marginBottom: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
});

export default SettingsScreen;