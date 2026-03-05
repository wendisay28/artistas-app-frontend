// src/screens/profile/components/modals/BioModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar // Añadido para control total
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

const MAX_CHARS = 300;

export const BioModal = ({ visible, initialValue, onClose, onSave }: Props) => {
  const insets = useSafeAreaInsets();
  const [bio, setBio] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      console.log("📝 BuscArt: Abriendo BioModal con valor inicial");
      setBio(initialValue || '');
    }
  }, [initialValue, visible]);

  const remaining = MAX_CHARS - bio.length;
  const fillPercent = ((MAX_CHARS - remaining) / MAX_CHARS) * 100;

  const handleSave = () => {
    console.log("💾 BuscArt: Guardando nueva Bio...");
    onSave(bio);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true} // Cambiado a true para que useSafeAreaInsets tenga sentido
      onRequestClose={onClose}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top || 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.accentBar}
              />
              <Text style={styles.title}>Sobre mí</Text>
            </View>

            <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
                styles.scrollContent, 
                { paddingBottom: insets.bottom + 20, flexGrow: 1 } 
            ]}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.subtitle}>Cuéntale al mundo tu historia</Text>
            <Text style={styles.label}>DESCRIPCIÓN PROFESIONAL</Text>

            {/* Input */}
            <View style={[styles.inputCard, focused && styles.inputCardFocused]}>
              <TextInput
                style={styles.textInput}
                value={bio}
                onChangeText={t => setBio(t.slice(0, MAX_CHARS))}
                multiline
                scrollEnabled={false}
                placeholder="Cuéntale al mundo tu trayectoria..."
                placeholderTextColor="rgba(124,58,237,0.25)"
                textAlignVertical="top"
                autoCorrect={false}
                autoFocus={true}
                onFocus={() => {
                    console.log("🎯 BuscArt: Input Bio enfocado");
                    setFocused(true);
                }}
                onBlur={() => setFocused(false)}
              />

              {/* Barra de progreso */}
              <View style={styles.counterRow}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={remaining < 30 ? ['#ef4444', '#f97316'] : ['#7c3aed', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.max(fillPercent, 2)}%` as any }]}
                  />
                </View>
                <Text style={[styles.counter, remaining < 30 && styles.counterWarn]}>
                  {remaining}
                </Text>
              </View>
            </View>

            {/* Tip */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconWrap}>
                <Ionicons name="bulb-outline" size={14} color="#7c3aed" />
              </View>
              <Text style={styles.tipText}>
                Una bio completa aumenta hasta{' '}
                <Text style={styles.tipBold}>3×</Text>{' '}
                tus posibilidades de ser contratado.
              </Text>
            </View>
            
            {/* Espacio flexible para evitar el vacío feo abajo */}
            <View style={{ flex: 1 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdfcff',
  },
  kav: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fdfcff',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentBar: {
    width: 3,
    height: 22,
    borderRadius: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.4,
  },
  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.5)',
  },
  saveBtn: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.12)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
    marginBottom: 22,
  },
  label: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.45)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputCard: {
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.22)',
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  inputCardFocused: {
    borderColor: '#7c3aed',
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 3,
  },
  textInput: {
    fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1e1b4b',
    lineHeight: 23,
    minHeight: 180,
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(167,139,250,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  counter: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)',
    minWidth: 26,
    textAlign: 'right',
  },
  counterWarn: {
    color: '#ef4444',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(245,243,255,0.7)',
    borderRadius: 14,
    padding: 13,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },
  tipIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.6)',
    lineHeight: 18,
  },
  tipBold: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
});