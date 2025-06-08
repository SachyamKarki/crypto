// components/BackgroundWrapper.tsx
import { ImageBackground, StyleSheet } from 'react-native';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require("../../assets/images/IMG_8517.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
