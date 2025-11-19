import React, { createContext, useState, useMemo, useEffect } from 'react';
import { darkTheme, lightTheme } from './themes';
import { getSettings, saveSettings } from '../utils/storage';

export const ThemeContext = createContext({
  isDark: false,
  theme: darkTheme,
  toggleTheme: () => { },
  reduceMotion: false,
  setReduceMotion: (value: boolean) => { },
  numPoints: 5, // New property
  setNumPoints: (value: number) => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [numPoints, setNumPoints] = useState(5);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      setIsDark(settings.isDarkTheme);
      setReduceMotion(settings.reduceMotion);
      setNumPoints(settings.numPoints);
    };
    loadSettings();
  }, []);

  const toggleTheme = async () => {
    setIsDark(!isDark);
    const settings = await getSettings();
    await saveSettings({ ...settings, isDarkTheme: !isDark });
  };

  const handleSetReduceMotion = async (value: boolean) => {
    setReduceMotion(value);
    const settings = await getSettings();
    await saveSettings({ ...settings, reduceMotion: value });
  };

  const handleSetNumPoints = async (value: number) => {
    setNumPoints(value);
    const settings = await getSettings();
    await saveSettings({ ...settings, numPoints: value });
  };

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{
      isDark,
      theme,
      toggleTheme,
      reduceMotion,
      setReduceMotion: handleSetReduceMotion,
      numPoints,
      setNumPoints: handleSetNumPoints,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
