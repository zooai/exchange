// Zoo Exchange mobile — declarative Expo config.
// Tenant identity (name, slug, scheme, bundle id) comes from @zooai/brand.
import brand from '@zooai/brand'

export default {
  expo: {
    name: brand.name,
    slug: brand.slug,
    scheme: brand.scheme,
    owner: brand.expoOwner,
    version: process.env.APP_VERSION || '0.1.0',
    orientation: 'portrait',
    icon: brand.iconUrl,
    splash: {
      image: brand.splashUrl,
      resizeMode: 'contain',
      backgroundColor: brand.primaryColor,
    },
    ios: {
      bundleIdentifier: brand.iosBundleId,
      supportsTablet: true,
    },
    android: {
      package: brand.androidPackage,
      adaptiveIcon: {
        foregroundImage: brand.iconUrl,
        backgroundColor: brand.primaryColor,
      },
    },
    plugins: ['expo-router'],
  },
}
