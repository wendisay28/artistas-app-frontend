// src/screens/onboarding/LocationScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type LocationData = {
  country: string;
  state: string;
  city: string;
};

type Props = NativeStackScreenProps<any, 'Location'>;

export const LocationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userType } = route.params as { userType: 'client' | 'artist' };
  
  const [location, setLocation] = useState<LocationData>({
    country: 'Colombia',
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState<Partial<LocationData>>({});

  const validateForm = () => {
    const newErrors: Partial<LocationData> = {};
    
    if (location.state.length < 2) {
      newErrors.state = 'Mínimo 2 caracteres';
    }
    
    if (location.city.length < 2) {
      newErrors.city = 'Mínimo 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Guardar ubicación en AsyncStorage o estado global
    // TODO: Implementar persistencia de ubicación

    if (userType === 'client') {
      navigation.navigate('Explore');
    } else {
      navigation.navigate('ArtistForm');
    }
  };

  const handleUseCurrentLocation = () => {
    // TODO: Implementar geolocalización
    console.log('Obtener ubicación actual');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>¿Dónde te encuentras?</Text>
          <Text style={styles.subtitle}>Te mostramos artistas cerca de ti</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>País</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>{location.country}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado/Departamento</Text>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              value={location.state}
              onChangeText={(text) => {
                setLocation(prev => ({ ...prev, state: text }));
                if (errors.state) setErrors(prev => ({ ...prev, state: undefined }));
              }}
              placeholder="Ej: Antioquia"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              value={location.city}
              onChangeText={(text) => {
                setLocation(prev => ({ ...prev, city: text }));
                if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
              }}
              placeholder="Ej: Medellín"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <TouchableOpacity 
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
          >
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.locationButtonText}>Usar mi ubicación actual</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  selectInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  locationButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
