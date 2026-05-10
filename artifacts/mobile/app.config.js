const baseUrl = process.env.EXPO_BASE_URL ?? "/";

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Align",
  slug: "mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mobile",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#0F2A4A",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.align.finance",
  },
  android: {
    package: "com.align.finance",
  },
  web: {
    favicon: "./assets/images/icon.png",
  },
  plugins: ["expo-router", "expo-font", "expo-web-browser"],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    baseUrl,
  },
};
