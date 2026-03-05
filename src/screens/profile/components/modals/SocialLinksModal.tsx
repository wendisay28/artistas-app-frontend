// src/screens/artist/profile/modals/SocialLinksModal.tsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SocialLinksData {
  instagram: string;
  tiktok: string;
  youtube: string;
  spotify: string;
}

interface Props {
  visible: boolean;
  initialData: SocialLinksData;
  onClose: () => void;
  onSave: (data: SocialLinksData) => void;
}

// ── Config de plataformas ─────────────────────────────────────────────────────
const PLATFORMS = [
  {
    key: 'instagram' as keyof SocialLinksData,
    label: 'Instagram',
    icon: 'logo-instagram' as const,
    gradient: ['#f9a8d4', '#E1306C'] as [string, string],
    prefix: '@',
    placeholder: 'tu.usuario',
  },
  {
    key: 'tiktok' as keyof SocialLinksData,
    label: 'TikTok',
    icon: 'logo-tiktok' as const,
    gradient: ['#fe2c55', '#111111'] as [string, string],
    prefix: '@',
    placeholder: 'tu_usuario',
  },
  {
    key: 'youtube' as keyof SocialLinksData,
    label: 'YouTube',
    icon: 'logo-youtube' as const,
    gradient: ['#fca5a5', '#FF0000'] as [string, string],
    prefix: '@',
    placeholder: 'TuCanal',
  },
  {
    key: 'spotify' as keyof SocialLinksData,
    label: 'Spotify',
    icon: 'musical-notes' as const,
    gradient: ['#86efac', '#1DB954'] as [string, string],
    prefix: '',
    placeholder: 'ID de artista o link',
  },
];

// ── SocialCard ────────────────────────────────────────────────────────────────
const SocialCard = memo(({
  platform,
  value,
  onUpdate,
}: {
  platform: typeof PLATFORMS[0];
  value: string;
  onUpdate: (key: keyof SocialLinksData, val: string) => void;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[sc.card, focused && sc.cardFocused]}>
      <LinearGradient
        colors={platform.gradient}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={sc.iconWrap}
      >
        <Ionicons name={platform.icon} size={20} color="#fff" />
      </LinearGradient>

      <View style={sc.inputSide}>
        <Text style={sc.platformLabel}>{platform.label}</Text>
        <View style={[sc.inputRow, focused && sc.inputRowFocused]}>
          {platform.prefix ? (
            <Text style={[sc.prefix, focused && sc.prefixFocused]}>{platform.prefix}</Text>
          ) : null}
          <TextInput
            style={sc.input}
            value={value}
            onChangeText={(v) => onUpdate(platform.key, v)}
            placeholder={platform.placeholder}
            placeholderTextColor="rgba(124,58,237,0.22)"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => {
              console.log(`🎯 Focus en: ${platform.key}`);
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>
    </View>
  );
});

// ── SocialLinksModal (Principal) ──────────────────────────────────────────────
export const SocialLinksModal: React.FC<Props> = ({ visible, initialData, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<SocialLinksData>({ instagram: '', tiktok: '', youtube: '', spotify: '' });

  useEffect(() => {
    if (visible) {
      console.log("📂 Cargando datos iniciales en SocialLinksModal");
      setData({
        instagram: initialData?.instagram || '',
        tiktok:    initialData?.tiktok    || '',
        youtube:   initialData?.youtube   || '',
        spotify:   initialData?.spotify   || '',
      });
    }
  }, [visible, initialData]);

  const handleUpdate = useCallback((key: keyof SocialLinksData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    console.log("💾 Guardando cambios en redes...", data);
    onSave(data);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[s.mainContainer, { paddingTop: insets.top || 20 }]}>
          <StatusBar barStyle="dark-content" />
          
          <KeyboardAvoidingView
            style={s.kav}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={s.header}>
              <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <View style={s.headerCenter}>
                <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.accentBar} />
                <Text style={s.title}>Redes Sociales</Text>
              </View>

              <TouchableOpacity onPress={handleSave}>
                <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.saveBtn}>
                  <Text style={s.saveBtnText}>Guardar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={s.divider} />

            <ScrollView
              style={s.scroll}
              contentContainerStyle={[
                s.content, 
                { paddingBottom: insets.bottom + 40, flexGrow: 1 } // flexGrow elimina el espacio blanco feo
              ]}
              keyboardShouldPersistTaps="always" // Esto permite que el input reciba el toque
            >
              <View style={s.tip}>
                <Ionicons name="sparkles" size={14} color="#7c3aed" />
                <Text style={s.tipText}>
                  Asegúrate de que tus perfiles sean públicos para que tus clientes puedan verte.
                </Text>
              </View>

              {/* Contenedor que distribuye las tarjetas */}
              <View style={s.cardsWrapper}>
                {PLATFORMS.map(platform => (
                  <SocialCard
                    key={platform.key}
                    platform={platform}
                    value={data[platform.key]}
                    onUpdate={handleUpdate}
                  />
                ))}
              </View>
              
              {/* Espacio flexible para empujar el contenido si hay pocos elementos */}
              <View style={{ flex: 1 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const sc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20, padding: 16,
    borderWidth: 1.2, borderColor: 'rgba(167,139,250,0.15)',
    // Sombra suave para que no se vea plano
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  cardFocused: {
    borderColor: '#7c3aed',
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  inputSide: { flex: 1, gap: 6 },
  platformLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(124,58,237,0.03)', borderRadius: 12, paddingHorizontal: 12, height: 42, borderWidth: 1, borderColor: 'rgba(167,139,250,0.1)', gap: 6 },
  inputRowFocused: { borderColor: '#7c3aed', backgroundColor: '#fff' },
  prefix: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.4)' },
  prefixFocused: { color: '#7c3aed' },
  input: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: '#1e1b4b', height: '100%' },
});

const s = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fdfcff' },
  kav: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accentBar: { width: 4, height: 24, borderRadius: 2 },
  title: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b' },
  cancelBtn: { padding: 4 },
  cancelText: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.6)' },
  saveBtn: { borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  saveBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(167,139,250,0.1)' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  cardsWrapper: { marginTop: 10 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(124,58,237,0.06)', padding: 14, borderRadius: 16, marginBottom: 20 },
  tipText: { flex: 1, fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: '#7c3aed', lineHeight: 16 },
});