// CompletedServiceCard.tsx
// Card de servicio "Finalizado" — historial, estado de pago y calificación.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../../theme/colors';
import type { CompletedContract } from '../../../../types/hiring';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CompletedServiceCardProps {
  contract: CompletedContract;
  onRate?: (contractId: string, rating: number, review: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

const formatTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '—';

const formatCOP = (n?: number) =>
  n ? `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })}` : '—';

// ── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}) {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={rm.overlay}>
        <View style={rm.sheet}>
          <Text style={rm.title}>Califica al cliente</Text>
          <Text style={rm.sub}>Tu opinión ayuda a mantener la comunidad de calidad.</Text>

          {/* Estrellas */}
          <View style={rm.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setStars(s)}>
                <Ionicons
                  name={s <= stars ? 'star' : 'star-outline'}
                  size={36}
                  color={s <= stars ? '#fbbf24' : '#d1d5db'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={rm.input}
            placeholder="Cuéntanos cómo fue la experiencia (opcional)"
            placeholderTextColor="#9ca3af"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={rm.submitBtn}
            onPress={() => { onSubmit(stars, review); onClose(); }}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#9333ea', '#2563eb']} style={rm.submitGradient}>
              <Text style={rm.submitText}>Enviar calificación</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={rm.cancelBtn}>
            <Text style={rm.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function CompletedServiceCard({ contract, onRate }: CompletedServiceCardProps) {
  const [ratingModal, setRatingModal] = useState(false);

  const {
    title, poster_name, milestones, completed_at,
    payment_status, artist_rating, amount, service_type,
  } = contract;

  // Config de estado de pago
  const PAYMENT_CONFIG = {
    pending:  { label: 'Pago en proceso',  color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline' },
    released: { label: 'Pago liberado',    color: '#10b981', bg: '#f0fdf4', icon: 'checkmark-circle-outline' },
    disputed: { label: 'En disputa',       color: '#ef4444', bg: '#fef2f2', icon: 'alert-circle-outline' },
  };
  const pConfig = PAYMENT_CONFIG[payment_status];

  const SERVICE_LABEL: Record<string, string> = {
    presencial: 'Presencial', hibrido: 'Híbrido', digital: 'Digital',
  };

  return (
    <View style={styles.card}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.completedBadge]}>
            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
            <Text style={styles.completedText}>Completado · {SERVICE_LABEL[service_type]}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.sub}>{poster_name}</Text>
        </View>
        {amount ? (
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedLabel}>Ganaste</Text>
            <Text style={styles.earnedAmount}>{formatCOP(amount)}</Text>
          </View>
        ) : null}
      </View>

      {/* ── Estado de pago ── */}
      <View style={[styles.paymentBanner, { backgroundColor: pConfig.bg }]}>
        <Ionicons name={pConfig.icon as any} size={18} color={pConfig.color} />
        <Text style={[styles.paymentText, { color: pConfig.color }]}>{pConfig.label}</Text>
        {payment_status === 'released' && (
          <View style={styles.paidPill}>
            <Text style={styles.paidPillText}>✓ Recibido</Text>
          </View>
        )}
      </View>

      {/* ── Timeline de cierre ── */}
      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>Resumen del servicio</Text>

        {milestones.arrival_checked && (
          <TimelineRow
            icon="enter-outline"
            label="Llegada registrada"
            value={formatTime(milestones.arrival_time)}
            color="#8b5cf6"
          />
        )}
        {milestones.departure_checked && (
          <TimelineRow
            icon="exit-outline"
            label="Salida registrada"
            value={formatTime(milestones.departure_time)}
            color="#3b82f6"
          />
        )}
        {milestones.delivery_submitted && (
          <TimelineRow
            icon="cloud-done-outline"
            label="Entregable enviado"
            value={milestones.delivery_link ?? '—'}
            color="#f59e0b"
            small
          />
        )}
        {milestones.delivery_accepted && (
          <TimelineRow
            icon="checkmark-done-circle-outline"
            label="Entrega aprobada por cliente"
            value={formatDate(completed_at)}
            color="#10b981"
          />
        )}
        <TimelineRow
          icon="calendar-outline"
          label="Fecha de cierre"
          value={formatDate(completed_at)}
          color="#6b7280"
        />
      </View>

      {/* ── Calificación del cliente ── */}
      <View style={styles.ratingSection}>
        {artist_rating ? (
          <View style={styles.ratingDone}>
            <Text style={styles.ratingDoneLabel}>Tu calificación al cliente</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= artist_rating ? 'star' : 'star-outline'}
                  size={18}
                  color={s <= artist_rating ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </View>
          </View>
        ) : onRate ? (
          <TouchableOpacity
            style={styles.rateBtn}
            onPress={() => setRatingModal(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="star-outline" size={16} color={Colors.primary} />
            <Text style={styles.rateBtnText}>Calificar la experiencia</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Rating modal */}
      <RatingModal
        visible={ratingModal}
        onClose={() => setRatingModal(false)}
        onSubmit={(rating, review) => onRate?.(contract.id, rating, review)}
      />
    </View>
  );
}

// ── Sub-componente: TimelineRow ───────────────────────────────────────────────

function TimelineRow({
  icon, label, value, color, small,
}: {
  icon: string; label: string; value: string; color: string; small?: boolean;
}) {
  return (
    <View style={tr.row}>
      <View style={[tr.dot, { backgroundColor: color + '20', borderColor: color }]}>
        <Ionicons name={icon as any} size={12} color={color} />
      </View>
      <View style={tr.body}>
        <Text style={tr.label}>{label}</Text>
        <Text style={[tr.value, small && { fontSize: 11 }]} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerLeft: { flex: 1, gap: 4 },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 4,
  },
  completedText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#10b981',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    lineHeight: 21,
  },
  sub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  earnedBadge: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  earnedLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#059669',
    marginBottom: 2,
  },
  earnedAmount: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#059669',
  },
  paymentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  paymentText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    flex: 1,
  },
  paidPill: {
    backgroundColor: '#10b981',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paidPillText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  timeline: {
    padding: 18,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  timelineTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6b7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ratingSection: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 14,
  },
  ratingDone: { gap: 6 },
  ratingDoneLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
  },
  rateBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
});

// TimelineRow styles
const tr = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  body: { flex: 1, gap: 1 },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#374151',
  },
  value: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
  },
});

// RatingModal styles
const rm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
    gap: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
  },
  sub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  starsRow: { flexDirection: 'row', gap: 8 },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827',
    minHeight: 80,
  },
  submitBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  submitGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  cancelBtn: { paddingVertical: 6 },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
});
