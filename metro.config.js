const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for NativeWind
config.transformer.babelTransformerPath = require.resolve('nativewind/dist/babel');

module.exports = config;
