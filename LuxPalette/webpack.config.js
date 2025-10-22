const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add a custom alias for react-native-reanimated to a web-compatible mock
  config.resolve.alias['react-native-reanimated'] = '@react-native-reanimated/web';

  return config;
};
