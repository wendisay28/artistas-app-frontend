// src/screens/artist/PortalAutorScreen.tsx
// Portal del Autor — muestra el estado de completitud del perfil del artista

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';

interface CompletionStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  points: number;
  done: boolean;
}

interface PortalAutorScreenProps {
  onClose: () => void;
}

export const PortalAutorScreen: React.FC<PortalAutorScreenProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { artistData } = useProfileStore();

  const hasSocialLinks = artistData?.info?.some((i) =>
    ['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
  );

  const steps: CompletionStep[] = [
    {
      id: 'photo',
      label: 'Foto de perfil',
      description: 'Añade una foto para que los clientes te reconozcan',
      icon: 'camera-outline',
      points: 15,
      done: !!(user?.photoURL || artistData?.avatar),
    },
    {
      id: 'bio',
      label: 'Descripción / Bio',
      description: 'Cuéntales a los clientes quién eres y qué haces',
      icon: 'document-text-outline',
      points: 15,
      done: !!(artistData?.bio || artistData?.description),
    },
    {
      id: 'category',
      label: 'Categoría artística',
      description: 'Define tu disciplina principal como artista',
      icon: 'sparkles-outline',
      points: 15,
      done: !!(artistData?.role || (artistData?.tags && artistData.tags.length > 0)),
    },
    {
      id: 'location',
      label: 'Ubicación',
      description: 'Los clientes cercanos podrán encontrarte más fácil',
      icon: 'location-outline',
      points: 10,
      done: !!(user?.city || artistData?.location),
    },
    {
      id: 'social',
      label: 'Redes sociales',
      description: 'Conecta Instagram, YouTube u otras redes',
      icon: 'share-social-outline',
      points: 10,
      done: !!hasSocialLinks,
    },
    {
      id: 'services',
      label: 'Servicios ofrecidos',
      description: 'Publica al menos un servicio con precio',
      icon: 'briefcase-outline',
      points: 20,
      done: false, // verificado al cargar los servicios
    },
    {
      id: 'portfolio',
      label: 'Portafolio de fotos',
      description: 'Muestra ejemplos de tu trabajo',
      icon: 'images-outline',
      points: 15,
      done: false, // verificado al cargar el portafolio
    },
  ];

  const completedPoints = steps.filter((s) => s.done).reduce((acc, s) => acc + s.points, 0);
  const totalPoints = steps.reduce((acc, s) => acc + s.points, 0);
  const completionPct = Math.round((completedPoints / totalPoints) * 100);

  const pendingSteps = steps.filter((s) => !s.done);
  const doneSteps = steps.filter((s) => s.done);

  const getCompletionColor = (): [string, string] => {
    if (completionPct >= 80) return ['#10b981', '#059669'];
    if (completionPct >= 50) return ['#9333ea', '#2563eb'];
    return ['#f59e0b', '#d97706'];
  };

  const getCompletionMessage = () => {
    if (completionPct === 100) return '¡Perfil completo! Recibirás 3× más clientes.';
    if (completionPct >= 80) return 'Casi listo. ¡Completa los últimos pasos!';
    if (completionPct >= 50) return 'Buen avance. Sigue completando tu perfil.';
    return 'Completa tu perfil para atraer más clientes.';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color="#4c1d95" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portal del Autor</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Completion hero */}
        <LinearGradient
          colors={getCompletionColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>Tu perfil está al</Text>
            <Text style={styles.heroPct}>{completionPct}%</Text>
            <Text style={styles.heroMsg}>{getCompletionMessage()}</Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroCircle}>
              <Text style={styles.heroCirclePct}>{completionPct}%</Text>
              <Text style={styles.heroCircleLabel}>completado</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progreso total</Text>
            <Text style={styles.progressPoints}>{completedPoints}/{totalPoints} pts</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={getCompletionColor()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${completionPct}%` }]}
            />
          </View>
        </View>

        {/* Pending steps */}
        {pendingSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pendiente ({pendingSteps.length})</Text>
            {pendingSteps.map((step) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepIconWrap}>
                  <Ionicons name={step.icon as any} size={22} color="#9333ea" />
                </View>
                <View style={styles.stepBody}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
                <View style={styles.stepPoints}>
                  <Text style={styles.stepPtsText}>+{step.points} pts</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Completed steps */}
        {doneSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completado ({doneSteps.length})</Text>
            {doneSteps.map((step) => (
              <View key={step.id} style={[styles.stepCard, styles.stepCardDone]}>
                <View style={[styles.stepIconWrap, styles.stepIconWrapDone]}>
                  <Ionicons name="checkmark" size={20} color="#10b981" />
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepLabel, styles.stepLabelDone]}>{step.label}</Text>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
                <View style={[styles.stepPoints, styles.stepPointsDone]}>
                  <Text style={[styles.stepPtsText, styles.stepPtsTextDone]}>{step.points} pts</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
          <Text style={styles.tipText}>
            Un perfil completo recibe hasta <Text style={styles.tipBold}>3× más solicitudes</Text> de clientes en tu zona.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4c1d95',
  },

  content: { paddingBottom: 24 },

  // Hero banner
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: { flex: 1 },
  heroTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  heroPct: {
    fontSize: 48,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    lineHeight: 52,
  },
  heroMsg: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    maxWidth: '90%',
  },
  heroRight: { alignItems: 'center' },
  heroCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCirclePct: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
  },
  heroCircleLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(255,255,255,0.85)',
  },

  // Progress
  progressSection: { marginHorizontal: 16, marginTop: 16 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4c1d95',
  },
  progressPoints: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#9333ea',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e9d5ff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: { height: 8, borderRadius: 4 },

  // Section
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4c1d95',
    marginBottom: 10,
  },

  // Step card
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#e9d5ff',
    gap: 12,
  },
  stepCardDone: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconWrapDone: {
    backgroundColor: '#dcfce7',
  },
  stepBody: { flex: 1 },
  stepLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4c1d95',
    marginBottom: 2,
  },
  stepLabelDone: { color: '#166534' },
  stepDesc: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    lineHeight: 15,
  },
  stepPoints: {
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepPointsDone: { backgroundColor: '#dcfce7' },
  stepPtsText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9333ea',
  },
  stepPtsTextDone: { color: '#16a34a' },

  // Tip
  tipCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#78350f',
    lineHeight: 18,
  },
  tipBold: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400e',
  },
});
