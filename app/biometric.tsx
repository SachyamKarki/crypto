import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function BiometricScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !enrolled) {
        Alert.alert("Biometrics Unavailable", "Use password instead.");
        router.replace("/home");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use passcode",
      });

      if (result.success) {
        router.replace("/home"); // Navigate to home on success
      } else {
        Alert.alert("Failed", "Authentication failed. Try again.");
        setChecking(false); // Show retry or stop screen
      }
    };

    authenticate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifying Identity...</Text>
      <ActivityIndicator size="large" color="#1a8e2d" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
});
