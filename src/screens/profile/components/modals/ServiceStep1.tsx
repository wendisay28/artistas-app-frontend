import React from 'react';
import {
  View, Text, TouchableOpacity, Image,
  ScrollView, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  localImageUri: string;
  coverImageUrl?: string;
  isEditing: boolean;
  onPickFromGallery: () => void;
  onSelectCover: () => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
};

// ── Step indicator (same as Step 2/3) ────────────────────────────────────────

const StepBar = () => (
  <View style={s.stepBar}>
    {(['Foto', 'Info', 'Entrega'] as const).map((label, idx) => {
      const active = idx === 0;
      return (
        <React.Fragment key={label}>
          <View style={s.stepItem}>
            <View style={[s.stepCircle, active && s.stepActive]}>
              <Text style={[s.stepNum, active && { color: '#fff' }]}>{idx + 1}</Text>
            </View>
            <Text style={[s.stepLabel, active && { color: '#7c3aed' }]}>{label}</Text>
          </View>
          {idx < 2 && <View style={s.stepLine} />}
        </React.Fragment>
      );
    })}
  </View>
);

// ── Main ─────────────────────────────────────────────────────────────────────

export const ServiceStep1: React.FC<Props> = ({
  localImageUri, coverImageUrl, isEditing,
  onPickFromGallery, onSelectCover, onContinue, onSkip, onBack,
}) => {
  const insets = useSafeAreaInsets();
  const hasImage = !!localImageUri;
  const isCoverSelected = !!coverImageUrl && localImageUri === coverImageUrl;

  return (
    <View style={{ flex: 1, backgroundColor: '#faf9ff' }}>
      {/* Header — igual que Step 2/3 */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onBack} style={s.headerSide} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            {!isEditing && <Ionicons name="chevron-back" size={18} color="rgba(124,58,237,0.55)" />}
            <Text style={s.headerBtn}>{isEditing ? 'Cancelar' : 'Cancelar'}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.headerTitle}>{isEditing ? 'Cambiar foto' : 'Nuevo Servicio'}</Text>
        </View>
        <View style={s.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <StepBar />

        {/* Título */}
        <Text style={s.title}>Foto del servicio</Text>
        <Text style={s.subtitle}>
          Una imagen atractiva aumenta{'\n'}la confianza de tus clientes
        </Text>

        {/* Zona principal de imagen */}
        <TouchableOpacity
          onPress={onPickFromGallery}
          activeOpacity={0.88}
          style={[s.uploadZone, hasImage && !isCoverSelected && s.uploadZoneActive]}
        >
          {hasImage && !isCoverSelected ? (
            /* Imagen seleccionada */
            <>
              <Image source={{ uri: localImageUri }} style={s.uploadImage} contentFit="cover" />
              <View style={s.uploadBadge}>
                <Ionicons name="camera-outline" size={14} color="#fff" />
                <Text style={s.uploadBadgeText}>Cambiar foto</Text>
              </View>
            </>
          ) : (
            /* Placeholder */
            <View style={s.uploadPlaceholder}>
              <LinearGradient
                colors={['#ede9fe', '#f5f3ff']}
                style={s.uploadIconBg}
              >
                <Ionicons name="camera-outline" size={30} color="#7c3aed" />
              </LinearGradient>
              <Text style={s.uploadPlaceholderTitle}>Toca para subir foto</Text>
              <Text style={s.uploadPlaceholderSub}>Desde tu galería · JPG, PNG</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Opción: usar portada */}
        {!!coverImageUrl && (
          <>
            <View style={s.orRow}>
              <View style={s.orLine} />
              <Text style={s.orText}>o usa tu portada actual</Text>
              <View style={s.orLine} />
            </View>

            <TouchableOpacity
              onPress={onSelectCover}
              style={[s.coverCard, isCoverSelected && s.coverCardActive]}
              activeOpacity={0.85}
            >
              <Image source={{ uri: coverImageUrl }} style={s.coverThumb} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={[s.coverTitle, isCoverSelected && { color: '#7c3aed' }]}>
                  {isCoverSelected ? 'Portada seleccionada' : 'Usar imagen de portada'}
                </Text>
                <Text style={s.coverSub}>
                  {isCoverSelected ? 'Toca para quitar' : 'Tu foto de portada actual'}
                </Text>
              </View>
              {isCoverSelected
                ? <View style={s.checkCircle}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                : <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              }
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={s.skipText}>Continuar sin foto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContinue} activeOpacity={0.88} style={s.continueWrap}>
          <LinearGradient colors={['#7c3aed', '#6d28d9']} style={s.continueBtn}>
            <Text style={s.continueBtnText}>{hasImage ? 'Continuar con foto' : 'Continuar'}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  headerSide: { width: 90 },
  headerBtn: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.55)' },
  headerTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },

  // Step bar
  stepBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: '#7c3aed' },
  stepNum: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#94a3b8' },
  stepLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#94a3b8' },
  stepLine: { flex: 1, height: 1.5, backgroundColor: '#e2e8f0', marginBottom: 16, marginHorizontal: 6 },

  // Content
  content: { paddingHorizontal: 20, paddingTop: 24 },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 24,
  },

  // Upload zone
  uploadZone: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.2)',
    borderStyle: 'dashed',
    backgroundColor: '#faf5ff',
    marginBottom: 20,
  },
  uploadZoneActive: {
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  uploadImage: { width: '100%', height: '100%' },
  uploadBadge: {
    position: 'absolute',
    bottom: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20,
  },
  uploadBadgeText: { color: '#fff', fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  uploadPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  uploadIconBg: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  uploadPlaceholderTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  uploadPlaceholderSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#a78bfa' },

  // Or divider
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: '#94a3b8' },

  // Cover card
  coverCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  coverCardActive: { borderColor: 'rgba(124,58,237,0.4)', backgroundColor: '#faf5ff' },
  coverThumb: { width: 52, height: 52, borderRadius: 12 },
  coverTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a', marginBottom: 2 },
  coverSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8' },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: 20, paddingTop: 12, gap: 10,
    backgroundColor: '#faf9ff',
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  skipText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium',
    color: '#94a3b8', textAlign: 'center',
  },
  continueWrap: { borderRadius: 18, overflow: 'hidden' },
  continueBtn: {
    paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  continueBtnText: { color: '#fff', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' },
});
