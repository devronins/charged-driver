const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs'); //for firebase js sdk

module.exports = withNativeWind(config, { input: './app/globals.css' });
