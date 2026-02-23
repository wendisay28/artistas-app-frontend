// src/screens/auth/setup-profile/index.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSetupProfile } from './hooks/useSetupProfile';

const SetupProfileScreen = () => {
  const {
    displayName, setDisplayName,
    username, setUsername,
    photoURI, pickPhoto,
    city, setCity,
    bio, setBio,
    isLoading,
    saveProfile
  } = useSetupProfile();

  const handleSave = async () => {
    const result = await saveProfile();
    if (result.success) {
      Alert.alert('Éxito', 'Tu perfil ha sido actualizado correctamente');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f23' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ 
            width: 40, height: 40, borderRadius: 20, 
            backgroundColor: 'rgba(124,58,237,0.1)', 
            justifyContent: 'center', alignItems: 'center' 
          }}>
            <Ionicons name="settings" size={20} color="#7c3aed" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' }}>
              Editar Perfil
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#9ca3af', marginTop: 2 }}>
              Actualiza tu información personal
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* Photo Upload */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <TouchableOpacity 
            onPress={pickPhoto}
            style={{ 
              position: 'relative', 
              width: 120, 
              height: 120, 
              borderRadius: 60 
            }}
          >
            {photoURI ? (
              <Image 
                source={{ uri: photoURI }} 
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 60 
                }} 
              />
            ) : (
              <LinearGradient 
                colors={['#7c3aed', '#a855f7']} 
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 60, 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
              >
                <Ionicons name="camera" size={30} color="#fff" />
              </LinearGradient>
            )}
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#7c3aed',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#0f0f23'
            }}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 13, 
            fontFamily: 'PlusJakartaSans_400Regular', 
            color: '#9ca3af', 
            marginTop: 8 
          }}>
            Toca para cambiar foto
          </Text>
        </View>

        {/* Form Fields */}
        <View style={{ marginTop: 32, gap: 20 }}>
          {/* Display Name */}
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontFamily: 'PlusJakartaSans_500Medium', 
              color: '#e5e7eb', 
              marginBottom: 8 
            }}>
              Nombre Artístico
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              borderWidth: 1, 
              borderColor: 'rgba(255,255,255,0.1)' 
            }}>
              <View style={{ paddingLeft: 16 }}>
                <Ionicons name="person" size={20} color="#9ca3af" />
              </View>
              <TextInput
                style={{ 
                  flex: 1, 
                  color: '#fff', 
                  fontSize: 16, 
                  fontFamily: 'PlusJakartaSans_400Regular', 
                  paddingVertical: 16, 
                  paddingHorizontal: 12 
                }}
                placeholder="Tu nombre artístico"
                placeholderTextColor="#6b7280"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Username */}
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontFamily: 'PlusJakartaSans_500Medium', 
              color: '#e5e7eb', 
              marginBottom: 8 
            }}>
              Nombre de Usuario
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              borderWidth: 1, 
              borderColor: 'rgba(255,255,255,0.1)' 
            }}>
              <View style={{ paddingLeft: 16 }}>
                <Ionicons name="at" size={20} color="#9ca3af" />
              </View>
              <TextInput
                style={{ 
                  flex: 1, 
                  color: '#fff', 
                  fontSize: 16, 
                  fontFamily: 'PlusJakartaSans_400Regular', 
                  paddingVertical: 16, 
                  paddingHorizontal: 12 
                }}
                placeholder="@nombredeusuario"
                placeholderTextColor="#6b7280"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* City */}
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontFamily: 'PlusJakartaSans_500Medium', 
              color: '#e5e7eb', 
              marginBottom: 8 
            }}>
              Ciudad
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              borderWidth: 1, 
              borderColor: 'rgba(255,255,255,0.1)' 
            }}>
              <View style={{ paddingLeft: 16 }}>
                <Ionicons name="location" size={20} color="#9ca3af" />
              </View>
              <TextInput
                style={{ 
                  flex: 1, 
                  color: '#fff', 
                  fontSize: 16, 
                  fontFamily: 'PlusJakartaSans_400Regular', 
                  paddingVertical: 16, 
                  paddingHorizontal: 12 
                }}
                placeholder="Tu ciudad"
                placeholderTextColor="#6b7280"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Bio */}
          <View>
            <Text style={{ 
              fontSize: 14, 
              fontFamily: 'PlusJakartaSans_500Medium', 
              color: '#e5e7eb', 
              marginBottom: 8 
            }}>
              Biografía
            </Text>
            <View style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: 12, 
              borderWidth: 1, 
              borderColor: 'rgba(255,255,255,0.1)',
              paddingHorizontal: 16,
              paddingVertical: 12
            }}>
              <TextInput
                style={{ 
                  flex: 1, 
                  color: '#fff', 
                  fontSize: 16, 
                  fontFamily: 'PlusJakartaSans_400Regular', 
                  minHeight: 80,
                  textAlignVertical: 'top'
                }}
                placeholder="Cuéntanos sobre ti..."
                placeholderTextColor="#6b7280"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <BlurView intensity={80} tint="dark" style={{ 
        paddingHorizontal: 20, 
        paddingTop: 16, 
        paddingBottom: 28 
      }}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={{
            backgroundColor: '#7c3aed',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontFamily: 'PlusJakartaSans_600SemiBold'
          }}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export default SetupProfileScreen;
