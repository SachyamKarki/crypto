import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ImageBackground,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [govIdImage, setGovIdImage] = useState<string | null>(null);

  const screenHeight = Dimensions.get('window').height;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const touchY = gestureState.moveY;
        const swipeDistanceX = Math.abs(gestureState.dx);
        return swipeDistanceX > 20 && touchY > screenHeight / 2;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && gestureState.moveY > screenHeight / 2) {
          router.replace('/identity/options');
        }
      },
    })
  ).current;

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateDOB = (dob: string) => /^\d{4}-\d{2}-\d{2}$/.test(dob);

  const handleRegister = async () => {
    if (!name || !dob || !gender || !email || !password || !confirmPassword || !profileImage || !govIdImage) {
      Alert.alert('Error', 'Please fill in all fields and upload required images.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!validateDOB(dob)) {
      Alert.alert('Invalid DOB', 'Please enter DOB in YYYY-MM-DD format.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    await SecureStore.setItemAsync('user_email', email);
    await SecureStore.setItemAsync('user_password', password);
    await SecureStore.setItemAsync('user_name', name);
    await SecureStore.setItemAsync('user_dob', dob);
    await SecureStore.setItemAsync('user_gender', gender);
    await SecureStore.setItemAsync('profile_image', profileImage);
    await SecureStore.setItemAsync('gov_id_image', govIdImage);
    await SecureStore.setItemAsync('isLoggedIn', 'true');
    await SecureStore.setItemAsync('isVerified', 'true');

    Alert.alert('Registration Successful');
    router.replace('/home');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/IMG_8517.jpg')}
      style={styles.background}
      resizeMode="cover"
      {...panResponder.panHandlers}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/identity/options')}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Register</Text>

          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />
          <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setProfileImage)}>
            <Text style={styles.imagePickerText}>
              {profileImage ? '✅ Profile Image Selected' : 'Upload Profile Picture'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setGovIdImage)}>
            <Text style={styles.imagePickerText}>
              {govIdImage ? '✅ Government ID Selected' : 'Upload Govt. ID Image'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/identity/login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 60,
    left: 20,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 140,
    paddingBottom: 60,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imagePickerText: { color: '#333', fontWeight: '500' },
  button: { backgroundColor: '#1a8e2d', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 15, color: '#1a8e2d' },
});
