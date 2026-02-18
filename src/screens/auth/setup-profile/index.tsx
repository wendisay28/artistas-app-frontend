// src/screens/auth/setup-profile/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSetupProfile } from './hooks/useSetupProfile';
import { StepIndicator } from './components/StepIndicator';
import { AvatarPicker } from './components/AvatarPicker';
import { RoleSelector } from './components/RoleSelector';
import { useAuthStore } from '../../../store/authStore';

export const SetupProfileScreen = () => {
  const { error } = useAuthStore();
  const {
    step, displayName, setDisplayName, photoURI, pickPhoto,
    role, setRole, isLoading, goNextStep, goPrevStep, submitProfile,
  } = useSetupProfile();

  const canProceed = step === 1 ? displayName.trim().length > 0 : step === 2 ? !!role : true;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StepIndicator total={2} current={step} />

        <View style={styles.content}>
          {step === 1 && (
            <AvatarPicker
              photoURI={photoURI}
              displayName={displayName}
              onPickPhoto={pickPhoto}
              onChangeName={setDisplayName}
            />
          )}
          {step === 2 && (
            <RoleSelector selectedRole={role} onSelect={setRole} />
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={goPrevStep}>
              <Text style={styles.backText}>← Atrás</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
            onPress={step < 2 ? goNextStep : submitProfile}
            disabled={!canProceed || isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.nextText}>{step < 2 ? 'Continuar' : 'Empezar'}</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  content: { flex: 1 },
  error: { color: '#E84393', textAlign: 'center', fontSize: 13, marginBottom: 12 },
  footer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  backBtn: { paddingHorizontal: 16, paddingVertical: 14 },
  backText: { fontSize: 15, color: '#636E72', fontWeight: '600' },
  nextBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: '#DFE6E9' },
  nextText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});