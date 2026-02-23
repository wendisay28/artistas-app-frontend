// components/hiring/cards/OfferStatusCard.tsx
//
// Card para mostrar una contratación activa/en curso con su estado visual
// completo. Se usa dentro del MyContractionsHub para el estado 'active'.

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../../theme/colors';
import CollaborationBadge, { Collaboration } from '../shared/CollaborationBadge';

// ── Tipos ────────────────────────────────────────────────────────────────────

export type OfferStatusStep = 'confirmed' | 'in_progress' | 'completed' | 'reviewed';

interface OfferStatusCardProps {
  contract: {
    id: string;
    title: string;
    counterpart_name: string;
    counterpart_avatar?: string;
    date?: string;
    location?: string;
    budget_agreed?: number;
    offer_type: 'hiring' | 'gig' | 'event' | 'collaboration';
    current_step: OfferStatusStep;
    collaborations?: Collaboration[];
    is_sent: boolean;
  };
  onPress?: () => void;
  onChatPress?: () => void;
  onAddCollaboration?: () => void;
  onCollaborationPress?: (collaborationId: string) => void;
}

// ── Pasos del proceso ────────────────────────────────────────────────────────

const STEPS: { key: OfferStatusStep; label: string }[] = [
  { key: 'confirmed', label: 'Confirmado' },
  { key: 'in_progress', label: 'En curso' },
  { key: 'completed', label: 'Completado' },
  { key: 'reviewed', label: 'Valorado' },
];

const STEP_INDEX: Record<OfferStatusStep, number> = {
  confirmed: 0,
  in_progress: 1,
  completed: 2,
  reviewed: 3,
};

const TYPE_LABELS: Record<string, string> = {
  hiring: 'Contratación',
  gig: 'Gig',
  event: 'Evento',
  collaboration: 'Colaboración',
};

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// ── ProgressSteps ────────────────────────────────────────────────────────────

function ProgressSteps({ currentStep }: { currentStep: OfferStatusStep }) {
  const currentIndex = STEP_INDEX[currentStep];

  return (
    <View style={styles.stepsContainer}>
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={step.key}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                ]}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                ) : isActive ? (
                  <View style={styles.stepDotInner} />
                ) : null}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isDone && styles.stepLabelDone,
                  isActive && styles.stepLabelActive,
                ]}
              >
                {step.label}
              </Text>
            </View>

            {!isLast && (
              <View
                style={[styles.stepLine, isDone && styles.stepLineDone]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ── OfferStatusCard ───────────────────────────────────────────────────────────

export default function OfferStatusCard({
  contract,
  onPress,
  onChatPress,
  onAddCollaboration,
  onCollaborationPress,
}: OfferStatusCardProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onPress?.();
  };

  const handleChatPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChatPress?.();
  };

  const showCollaborations =
    contract.offer_type !== 'collaboration' && // las colaboraciones no tienen sub-colaboraciones
    contract.current_step !== 'reviewed';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
    >
      {/* Franja superior de acento verde "En curso" */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topAccent}
      >
        <View style={styles.accentContent}>
          <Ionicons name="checkmark-circle" size={13} color="rgba(255,255,255,0.9)" />
          <Text style={styles.accentText}>
            {TYPE_LABELS[contract.offer_type] ?? 'Contratación'} en curso
          </Text>
        </View>
        <Text style={styles.accentId}>#{contract.id.slice(0, 6).toUpperCase()}</Text>
      </LinearGradient>

      <View style={styles.inner}>
        {/* Header: título + acciones */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title} numberOfLines={2}>
              {contract.title}
            </Text>
            <View style={styles.directionRow}>
              <Text style={styles.directionText}>
                {contract.is_sent ? 'Contrataste a' : 'Te contrató'}
              </Text>
              <View style={[
                styles.counterpartAvatar,
                { backgroundColor: avatarColor(contract.counterpart_name) }
              ]}>
                <Text style={styles.counterpartAvatarText}>
                  {getInitials(contract.counterpart_name)}
                </Text>
              </View>
              <Text style={styles.counterpartName} numberOfLines={1}>
                {contract.counterpart_name}
              </Text>
            </View>
          </View>

          {/* Chat */}
          <Pressable
            onPress={handleChatPress}
            style={({ pressed }) => [styles.chatBtn, pressed && { opacity: 0.7 }]}
          >
            <MaterialCommunityIcons name="chat-outline" size={18} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Meta: fecha y lugar */}
        <View style={styles.metaRow}>
          {contract.date && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{contract.date}</Text>
            </View>
          )}
          {contract.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{contract.location}</Text>
            </View>
          )}
          {contract.budget_agreed && (
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={13} color="#10B981" />
              <Text style={[styles.metaText, { color: '#10B981' }]}>
                ${contract.budget_agreed}
              </Text>
            </View>
          )}
        </View>

        {/* Progress steps */}
        <ProgressSteps currentStep={contract.current_step} />

        {/* Colaboraciones anidadas */}
        {showCollaborations && (
          <View style={styles.collaborationsSection}>
            <CollaborationBadge
              collaborations={contract.collaborations ?? []}
              canAddMore={contract.current_step !== 'completed'}
              onAddCollaboration={onAddCollaboration}
              onCollaborationPress={onCollaborationPress}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  // Franja superior
  topAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  accentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accentText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
  },
  accentId: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.7)',
  },

  inner: {
    padding: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 21,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  counterpartAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterpartAvatarText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  counterpartName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },

  // Progress steps
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stepDotDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepDotActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
  },
  stepDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  stepLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textLight,
    textAlign: 'center',
  },
  stepLabelDone: {
    color: '#10B981',
  },
  stepLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: 14,
    marginHorizontal: 2,
  },
  stepLineDone: {
    backgroundColor: '#10B981',
  },

  // Colaboraciones
  collaborationsSection: {
    marginTop: 2,
  },
});