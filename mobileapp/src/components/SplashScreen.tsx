import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

// Matches the background baked into logo-2.png so the splash screen and
// the image blend together with no visible edge.
const SPLASH_BACKGROUND_COLOR = '#f4f5ef';

const SplashScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Image
        source={require('../assets/images/logo-2.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel={t('splash.logoAlt')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SPLASH_BACKGROUND_COLOR,
  },
  logo: {
    width: '70%',
    maxWidth: 320,
    aspectRatio: 961 / 360,
  },
});

export default SplashScreen;
