import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
    Dimensions,
    GestureResponderEvent,
    ImageBackground,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function AuthOptionsScreen() {
  const router = useRouter();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const touchY = gestureState.moveY;
        const swipeDistanceX = Math.abs(gestureState.dx);
        return swipeDistanceX > 20 && touchY > screenHeight / 2;
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx < -50 && gestureState.moveY > screenHeight / 2) {
          router.replace('/home');
        }
      },
    })
  ).current;

  return (
    <ImageBackground
      source={require('../../assets/images/IMG_8517.jpg')}
      style={styles.background}
      resizeMode="cover"
      {...panResponder.panHandlers}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome to Car Marketplace</Text>

          <TouchableOpacity style={styles.authButton} onPress={() => router.push("/identity/login")}>
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.authButton, styles.registerButton]}
            onPress={() => router.push("/identity/register")}
          >
            <Text style={styles.authButtonText}>Register an Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  authButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 8,
    width: '100%',
  },
  registerButton: { backgroundColor: '#4b5563' },
  authButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  line: { flex: 1, height: 1, backgroundColor: '#ccc' },
  orText: { marginHorizontal: 10, color: '#888', fontWeight: '600' },
});
