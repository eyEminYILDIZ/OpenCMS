import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

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
    backgroundColor: colors.background,
  },
  logo: {
    width: '70%',
    maxWidth: 320,
    aspectRatio: 961 / 360,
  },
});

export default SplashScreen;
