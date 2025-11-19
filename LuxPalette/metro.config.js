const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add mjs extension for Tamagui
  config.resolver.sourceExts.push('mjs');

  // Add cjs extension
  config.resolver.sourceExts.push('cjs');

  return config;
})();
