// ─────────────────────────────────────────────────────────────────────────────
// VideoUploadModal.tsx — Seleccionar, previsualizar, recortar y subir video
// Muestra el video en la MISMA proporción que la sección de imagen de las tarjetas
// para que el creador vea exactamente cómo quedará antes de subir.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { useVideoPlayer, VideoView } from 'expo-video';
import { storageService } from '../../../services/api/storage';

// ── Calcular proporción igual a la sección de imagen de las tarjetas ─────────

const { width: SW, height: SH } = Dimensions.get('window');
// Replica exacta de la fórmula en SwipeCard.tsx
const CARD_W = Math.min(SW - 32, 420);
const CARD_H = SH * 0.72;
// imageSection height es 65% (Artist) o 65% (Event/Venue/Gallery) del card
const IMAGE_RATIO = 0.65;
const CARD_AR = CARD_W / (CARD_H * IMAGE_RATIO); // ≈ 0.91 (casi cuadrado, ligeramente portrait)

const PREVIEW_W = SW - 48;
const PREVIEW_H = Math.round(PREVIEW_W / CARD_AR);

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface VideoUploadResult {
  /** URL pública del video ya subido al backend */
  uri: string;
  /** Segundo de inicio para la reproducción en la tarjeta */
  startTime: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Se llama cuando el video se sube con éxito */
  onUploaded: (result: VideoUploadResult) => void;
}

type Step = 'pick' | 'preview' | 'uploading';

// ── Componente ────────────────────────────────────────────────────────────────

export default function VideoUploadModal({ visible, onClose, onUploaded }: Props) {
  const [step, setStep]           = useState<Step>('pick');
  const [videoUri, setVideoUri]   = useState<string | null>(null);
  const [duration, setDuration]   = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [progress, setProgress]   = useState(0);
  const [asset, setAsset]         = useState<ImagePicker.ImagePickerAsset | null>(null);

  // Player siempre creado; si videoUri es '' no carga nada
  const player = useVideoPlayer(videoUri ?? '', (p) => {
    p.loop = true;
    p.play();
  });

  const reset = useCallback(() => {
    setStep('pick');
    setVideoUri(null);
    setDuration(0);
    setStartTime(0);
    setProgress(0);
    setAsset(null);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  // Mover el punto de inicio y sincronizar el player
  const handleSlider = useCallback(
    (val: number) => {
      setStartTime(val);
      try {
        player.currentTime = val;
      } catch {}
    },
    [player],
  );

  const pickVideo = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir un video.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 1,
      videoMaxDuration: 60,
    });
    if (result.canceled || !result.assets?.length) return;
    const a = result.assets[0];
    setAsset(a);
    setVideoUri(a.uri);
    setDuration(a.duration ?? 30);
    setStartTime(0);
    setStep('preview');
  };

  const upload = async () => {
    if (!asset) return;
    setStep('uploading');
    setProgress(0);
    try {
      const res = await storageService.uploadVideo(asset, (p) => setProgress(p));
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onUploaded({ uri: res.imageUrl, startTime });
      handleClose();
    } catch {
      Alert.alert('Error', 'No se pudo subir el video. Inténtalo de nuevo.');
      setStep('preview');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* ── Header ────────────────────────────────────────────── */}
          <View style={s.header}>
            <Pressable onPress={handleClose} style={s.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color="#1e1b4b" />
            </Pressable>
            <Text style={s.title}>Video para la tarjeta</Text>
            <View style={{ width: 34 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.scrollContent}
            bounces={false}
          >
            {/* ── Step 1: elegir ──────────────────────────────────── */}
            {step === 'pick' && (
              <View style={s.body}>
                {/* Silueta con la proporción exacta de la tarjeta */}
                <View style={[s.previewBox, { width: PREVIEW_W, height: PREVIEW_H }]}>
                  <View style={s.placeholder}>
                    <Ionicons name="videocam-outline" size={44} color="rgba(124,58,237,0.22)" />
                    <Text style={s.placeholderTitle}>Así se verá en la tarjeta</Text>
                    <Text style={s.placeholderSub}>
                      El video se recorta automáticamente{'\n'}para ajustarse a este espacio
                    </Text>
                  </View>
                  {/* Esquinas de encuadre estilo cámara */}
                  <View style={[s.corner, s.cornerTL]} />
                  <View style={[s.corner, s.cornerTR]} />
                  <View style={[s.corner, s.cornerBL]} />
                  <View style={[s.corner, s.cornerBR]} />
                </View>

                <Pressable onPress={pickVideo}>
                  <LinearGradient
                    colors={['#7c3aed', '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[s.pickBtn, { width: PREVIEW_W }]}
                  >
                    <Ionicons name="videocam" size={20} color="#fff" />
                    <Text style={s.pickBtnText}>Elegir video de la galería</Text>
                  </LinearGradient>
                </Pressable>

                <Text style={s.hint}>
                  Máx. 60 segundos · El video se mostrará recortado (tipo "cover") en la proporción de la tarjeta
                </Text>
              </View>
            )}

            {/* ── Step 2: preview + recorte ────────────────────── */}
            {step === 'preview' && videoUri && (
              <View style={s.body}>
                {/* Preview en proporción exacta de tarjeta */}
                <View style={[s.previewBox, { width: PREVIEW_W, height: PREVIEW_H }]}>
                  <VideoView
                    player={player}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    nativeControls={false}
                  />
                  {/* Marco de recorte visible */}
                  <View style={s.cropFrame} pointerEvents="none" />
                  {/* Badge informativo */}
                  <View style={s.previewBadge}>
                    <Ionicons name="cut-outline" size={11} color="#fff" />
                    <Text style={s.previewBadgeText}>Vista previa — recortado para tarjeta</Text>
                  </View>
                </View>

                {/* Slider de recorte — solo si el video es más largo de 8 segundos */}
                {duration > 8 && (
                  <View style={[s.trimBox, { width: PREVIEW_W }]}>
                    <View style={s.trimHeader}>
                      <Ionicons name="time-outline" size={14} color="#7c3aed" />
                      <Text style={s.trimTitle}>
                        Inicio: {startTime.toFixed(1)}s de {duration.toFixed(0)}s totales
                      </Text>
                    </View>
                    <Slider
                      style={s.slider}
                      minimumValue={0}
                      maximumValue={Math.max(0, duration - 5)}
                      value={startTime}
                      onValueChange={handleSlider}
                      minimumTrackTintColor="#7c3aed"
                      maximumTrackTintColor="rgba(124,58,237,0.15)"
                      thumbTintColor="#7c3aed"
                      step={0.5}
                    />
                    <Text style={s.trimHint}>
                      Arrastra para elegir qué parte del video se muestra en la tarjeta
                    </Text>
                  </View>
                )}

                <View style={[s.actions, { width: PREVIEW_W }]}>
                  <Pressable
                    style={s.changeBtn}
                    onPress={() => { setStep('pick'); setVideoUri(null); }}
                  >
                    <Text style={s.changeBtnText}>Cambiar video</Text>
                  </Pressable>
                  <Pressable onPress={upload} style={{ flex: 1 }}>
                    <LinearGradient
                      colors={['#7c3aed', '#4f46e5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={s.uploadBtn}
                    >
                      <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                      <Text style={s.uploadBtnText}>Subir video</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── Step 3: subiendo ─────────────────────────────── */}
            {step === 'uploading' && (
              <View style={s.uploadingBody}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={s.uploadingTitle}>Subiendo video...</Text>
                <View style={s.progressTrack}>
                  <View style={[s.progressFill, { width: `${progress}%` as any }]} />
                </View>
                <Text style={s.uploadingPct}>{progress}%</Text>
                <Text style={s.uploadingHint}>No cierres la app hasta que termine</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const CORNER_SIZE = 16;
const CORNER_W = 3;
const CORNER_COLOR = 'rgba(124,58,237,0.7)';

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fdfcff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.18)',
    maxHeight: '94%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.12)',
  },
  closeBtn: { padding: 4 },
  title: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  scrollContent: {
    paddingBottom: 8,
  },

  body: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
    paddingBottom: 8,
  },

  // Caja preview con proporción exacta de imagen de tarjeta
  previewBox: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f3f0ff',
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  placeholderTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: 'rgba(124,58,237,0.5)',
    textAlign: 'center',
  },
  placeholderSub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.35)',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Esquinas de encuadre estilo cámara
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: 10, left: 10,
    borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W,
    borderColor: CORNER_COLOR, borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 10, right: 10,
    borderTopWidth: CORNER_W, borderRightWidth: CORNER_W,
    borderColor: CORNER_COLOR, borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 10, left: 10,
    borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W,
    borderColor: CORNER_COLOR, borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 10, right: 10,
    borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W,
    borderColor: CORNER_COLOR, borderBottomRightRadius: 6,
  },

  // Marco de recorte en modo preview
  cropFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2.5,
    borderColor: 'rgba(124,58,237,0.55)',
    borderRadius: 18,
  },
  previewBadge: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  previewBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },

  // Botón elegir video
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  pickBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  hint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },

  // Trim slider
  trimBox: {
    backgroundColor: 'rgba(124,58,237,0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.12)',
    gap: 4,
  },
  trimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trimTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  trimHint: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)',
    textAlign: 'center',
  },

  // Botones de acción (preview)
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 4,
  },
  changeBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.3)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  changeBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  uploadBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  // Uploading
  uploadingBody: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 16,
  },
  uploadingTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  uploadingPct: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
  uploadingHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
});
