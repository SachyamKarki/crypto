import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const uri = await SecureStore.getItemAsync('profile_image');
      const storedName = await SecureStore.getItemAsync('user_name');
      const storedEmail = await SecureStore.getItemAsync('user_email');
      setProfileImage(uri);
      setName(storedName || 'N/A');
      setEmail(storedEmail || 'N/A');
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('isLoggedIn');
    await SecureStore.deleteItemAsync('isVerified');
    await SecureStore.deleteItemAsync('user_email');
    await SecureStore.deleteItemAsync('user_password');
    await SecureStore.deleteItemAsync('user_name');
    await SecureStore.deleteItemAsync('user_dob');
    await SecureStore.deleteItemAsync('user_gender');
    await SecureStore.deleteItemAsync('profile_image');
    await SecureStore.deleteItemAsync('gov_id_image');
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('/identity/options');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/car1.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.optionSection}>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/identity/register')}>
          <Ionicons name="create-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
          <Text style={[styles.optionText, { color: '#d32f2f' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  optionSection: {
    marginTop: 30,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});
