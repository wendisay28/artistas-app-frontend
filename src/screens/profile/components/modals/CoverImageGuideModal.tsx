// ─────────────────────────────────────────────────────────────────────────────
// CoverImageGuideModal.tsx — Guía imagen de portada · diseño limpio
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ── Paleta unificada ──────────────────────────────────────────────────────────

const Brand = {
  purple:      '#7c3aed',
  purpleLight: 'rgba(124,58,237,0.08)',
  purpleMid:   'rgba(124,58,237,0.2)',
  purpleFade:  'rgba(124,58,237,0.45)',
  blue:        '#2563eb',
  bg:          '#faf9ff',
  surface:     'rgba(255,255,255,0.9)',
  border:      'rgba(167,139,250,0.2)',
  text:        '#1e1b4b',
  textMuted:   'rgba(109,40,217,0.4)',
  white:       '#fff',
};

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: (useCamera: boolean) => void;
};

// ── Componente ────────────────────────────────────────────────────────────────

export const CoverImageGuideModal: React.FC<Props> = ({ visible, onClose, onContinue }) => (
  <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
    <View style={s.overlay}>
      <View style={s.card}>

        {/* ── Preview de portada ── */}
        <View style={s.previewWrap}>
          <LinearGradient
            colors={['#ede8ff', '#dbeafe', '#f5f2ff']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.preview}
          >
            <Ionicons name="image-outline" size={36} color={Brand.purple} />
            <Text style={s.previewLabel}>Tu portada aquí</Text>
            <Text style={s.previewSub}>16:9 · 1200×675px · máx. 2MB</Text>
          </LinearGradient>

          {/* Botón cerrar flotante */}
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.8}>
            <Ionicons name="close" size={18} color={Brand.purple} />
          </TouchableOpacity>
        </View>

        {/* ── Título ── */}
        <View style={s.body}>
          <Text style={s.title}>Imagen de portada</Text>
          <Text style={s.subtitle}>Usa una foto horizontal de alta calidad que refleje tu estilo artístico.</Text>

          {/* ── Tips compactos ── */}
          <View style={s.tips}>
            {[
              { icon: 'sunny-outline',       text: 'Buena iluminación y colores vibrantes' },
              { icon: 'text-outline',         text: 'Sin texto ni logos encima' },
              { icon: 'color-palette-outline',text: 'Que represente tu estilo único' },
            ].map((tip, i) => (
              <View key={i} style={s.tip}>
                <View style={s.tipIcon}>
                  <Ionicons name={tip.icon as any} size={14} color={Brand.purple} />
                </View>
                <Text style={s.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Acciones ── */}
        <View style={s.actions}>
          <TouchableOpacity onPress={onClose} style={s.cancelBtn} activeOpacity={0.7}>
            <Text style={s.cancelText}>Ahora no</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              console.log('CoverImageGuideModal: Botón cámara presionado');
              onContinue(true); // Pass true for camera
            }} 
            style={[s.continueBtn, { backgroundColor: '#10b981', marginBottom: 8 }]} 
            activeOpacity={0.85}
          >
            <View style={[s.continueBtnGradient, { backgroundColor: '#10b981' }]}>
              <Ionicons name="camera-outline" size={16} color={Brand.white} />
              <Text style={s.continueText}>Usar cámara</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              console.log('CoverImageGuideModal: Botón Elegir foto presionado');
              console.log('Llamando a onContinue...');
              onContinue(false); // Pass false for gallery
            }} 
            style={s.continueBtn} 
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.continueBtnGradient}
            >
              <Ionicons name="camera-outline" size={16} color={Brand.white} />
              <Text style={s.continueText}>Elegir foto</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  </Modal>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const PREVIEW_W = width * 0.82;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,27,75,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: Brand.bg,
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Brand.border,
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 16,
  },

  // Preview
  previewWrap: { position: 'relative' },
  preview: {
    width: '100%',
    height: PREVIEW_W * 9 / 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Brand.purple,
  },
  previewSub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Brand.purpleFade,
    letterSpacing: 0.3,
  },
  closeBtn: {
    position: 'absolute',
    top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Brand.border,
  },

  // Body
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Brand.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Brand.textMuted,
    lineHeight: 19,
  },

  // Tips
  tips: { gap: 8, marginTop: 2 },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Brand.purpleLight,
    borderWidth: 1, borderColor: Brand.purpleMid,
    alignItems: 'center', justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Brand.text,
  },

  // Acciones
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Brand.purpleFade,
  },
  continueBtn: {
    flex: 1.6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  continueBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
  },
  continueText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Brand.white,
  },
});