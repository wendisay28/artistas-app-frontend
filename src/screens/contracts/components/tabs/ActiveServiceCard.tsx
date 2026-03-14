// ActiveServiceCard.tsx
// Card de servicio "En Curso" con validación de hitos estilo Uber/Rappi.
//
// Presencial  → Hito 1 (llegada QR) → Hito 2 (salida QR) → Completado
// Híbrido     → Hito 1 → Hito 2 → Entrega Digital (1 cambio) → Aceptado
// Digital     → Entrega Digital (1 cambio) → Aceptado por cliente

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../../theme/colors';
import type { ActiveContract, MilestoneState, ServiceType } from '../../../../types/hiring';
import CodeEntryModal from '../modals/CodeEntryModal';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ActiveServiceCardProps {
  contract: ActiveContract;
  onMilestoneUpdate: (contractId: string, updated: Partial<MilestoneState>) => void;
  onComplete: (contractId: string) => void;
  onMessage?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatTime = (iso?: string) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

const formatCOP = (n?: number) =>
  n ? `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })}` : '';

const formatTimeLeft = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

/** Paso del timeline — muestra ícono + línea + estado */
function MilestoneStep({
  icon,
  label,
  sublabel,
  done,
  active,
  locked,
  lockReason,
  onPress,
  color = '#7c3aed',
}: {
  icon: string;
  label: string;
  sublabel?: string;
  done?: boolean;
  active?: boolean;
  locked?: boolean;
  lockReason?: string;
  onPress?: () => void;
  color?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePress = () => {
    if (locked) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
      return;
    }
    onPress?.();
  };

  return (
    <View style={ms.wrapper}>
      {/* Círculo estado */}
      <View style={ms.leftCol}>
        <View
          style={[
            ms.circle,
            done && { backgroundColor: '#10b981', borderColor: '#10b981' },
            active && { borderColor: color, borderWidth: 2.5 },
            locked && ms.circleLocked,
          ]}
        >
          {done ? (
            <Ionicons name="checkmark" size={16} color="#fff" />
          ) : (
            <Ionicons
              name={icon as any}
              size={15}
              color={locked ? '#9ca3af' : active ? color : '#9ca3af'}
            />
          )}
        </View>
        <View style={ms.line} />
      </View>

      {/* Contenido */}
      <View style={ms.body}>
        <Text style={[ms.label, done && ms.labelDone, locked && ms.labelLocked]}>
          {label}
        </Text>
        {sublabel ? <Text style={ms.sublabel}>{sublabel}</Text> : null}

        {/* Tooltip de bloqueo */}
        {showTooltip && lockReason ? (
          <View style={ms.tooltip}>
            <Ionicons name="lock-closed-outline" size={12} color="#ef4444" />
            <Text style={ms.tooltipText}>{lockReason}</Text>
          </View>
        ) : null}

        {/* Botón de acción */}
        {!done && !locked && active && onPress ? (
          <TouchableOpacity onPress={handlePress} style={[ms.actionBtn, { borderColor: color }]} activeOpacity={0.8}>
            <Ionicons name={icon as any} size={14} color={color} />
            <Text style={[ms.actionText, { color }]}>{label}</Text>
          </TouchableOpacity>
        ) : locked ? (
          <TouchableOpacity onPress={handlePress} style={ms.actionBtnLocked} activeOpacity={0.9}>
            <Ionicons name="lock-closed-outline" size={13} color="#9ca3af" />
            <Text style={ms.actionTextLocked}>{label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ActiveServiceCard({
  contract,
  onMilestoneUpdate,
  onComplete,
  onMessage,
}: ActiveServiceCardProps) {
  const { milestones, service_type, offer_type, title, poster_name, location, date, amount } = contract;

  const [codeModal, setCodeModal] = useState<'arrival' | 'departure' | null>(null);
  const [deliveryLink, setDeliveryLink] = useState(milestones.delivery_link ?? '');
  const [submittingLink, setSubmittingLink] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // ── Timer 48h — si delivery_submitted y el cliente no ha aceptado ──────────
  useEffect(() => {
    if (!milestones.delivery_submitted || milestones.delivery_accepted) {
      setTimeLeft(null);
      return;
    }
    const deadline = contract.deadline
      ? new Date(contract.deadline).getTime()
      : Date.now() + 48 * 60 * 60 * 1000;

    const tick = () => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        onMilestoneUpdate(contract.id, { delivery_accepted: true });
        setTimeout(() => onComplete(contract.id), 500);
        return;
      }
      setTimeLeft(remaining);
    };

    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestones.delivery_submitted, milestones.delivery_accepted, contract.deadline]);

  // ── Handlers hitos ────────────────────────────────────────────────────────

  const handleCodeConfirm = (code: string) => {
    const now = new Date().toISOString();
    if (codeModal === 'arrival') {
      onMilestoneUpdate(contract.id, { arrival_checked: true, arrival_time: now });
    } else {
      onMilestoneUpdate(contract.id, { departure_checked: true, departure_time: now });
      // Si es presencial puro → completar automáticamente al validar salida
      if (service_type === 'presencial') {
        Alert.alert(
          '¡Servicio finalizado!',
          'El código de salida fue validado. El pago se procesará en los próximos minutos.',
          [{ text: 'Entendido', onPress: () => onComplete(contract.id) }]
        );
      }
    }
    setCodeModal(null);
  };

  const handleSubmitDelivery = async () => {
    if (!deliveryLink.trim()) {
      Alert.alert('Link requerido', 'Ingresa el link o nombre del archivo entregable.');
      return;
    }
    setSubmittingLink(true);
    await new Promise((r) => setTimeout(r, 600));
    onMilestoneUpdate(contract.id, { delivery_submitted: true, delivery_link: deliveryLink.trim() });
    setSubmittingLink(false);
  };

  // ── Layout según tipo de servicio ─────────────────────────────────────────

  const renderMilestones = () => {
    const arrivalDone   = milestones.arrival_checked;
    const departureDone = milestones.departure_checked;
    const deliveryDone  = milestones.delivery_submitted;
    const accepted      = milestones.delivery_accepted;
    const changeUsed    = milestones.change_request_used;

    if (service_type === 'presencial') {
      return (
        <>
          <MilestoneStep
            icon="qr-code-outline"
            label="Registrar llegada"
            sublabel={arrivalDone ? `Llegaste a las ${formatTime(milestones.arrival_time)}` : 'Muéstrale tu código al cliente'}
            done={arrivalDone}
            active={!arrivalDone}
            onPress={() => setCodeModal('arrival')}
            color="#8b5cf6"
          />
          <MilestoneStep
            icon="checkmark-done-circle-outline"
            label="Registrar salida"
            sublabel={departureDone ? `Saliste a las ${formatTime(milestones.departure_time)}` : 'Pídele el código de cierre al cliente'}
            done={departureDone}
            active={arrivalDone && !departureDone}
            locked={!arrivalDone}
            lockReason="Código de llegada pendiente"
            onPress={() => setCodeModal('departure')}
            color="#10b981"
          />
        </>
      );
    }

    if (service_type === 'hibrido') {
      return (
        <>
          <MilestoneStep
            icon="qr-code-outline"
            label="Registrar llegada"
            sublabel={arrivalDone ? `Llegaste a las ${formatTime(milestones.arrival_time)}` : 'Muéstrale tu código al cliente'}
            done={arrivalDone}
            active={!arrivalDone}
            onPress={() => setCodeModal('arrival')}
            color="#8b5cf6"
          />
          <MilestoneStep
            icon="exit-outline"
            label="Registrar salida"
            sublabel={departureDone ? `Saliste a las ${formatTime(milestones.departure_time)}` : 'Pídele el código de cierre al cliente'}
            done={departureDone}
            active={arrivalDone && !departureDone}
            locked={!arrivalDone}
            lockReason="Código de llegada pendiente"
            onPress={() => setCodeModal('departure')}
            color="#3b82f6"
          />
          <MilestoneStep
            icon="cloud-upload-outline"
            label="Entrega digital"
            sublabel={deliveryDone ? `Entregado: ${milestones.delivery_link}` : 'Sube tu archivo o link de entregable'}
            done={deliveryDone && !milestones.change_requested}
            active={departureDone && !deliveryDone}
            locked={!departureDone}
            lockReason="Completa los hitos presenciales primero"
            color="#f59e0b"
          />
          {departureDone && !deliveryDone && (
            <DeliveryInput
              value={deliveryLink}
              onChange={setDeliveryLink}
              onSubmit={handleSubmitDelivery}
              loading={submittingLink}
              changeUsed={changeUsed}
            />
          )}
          {deliveryDone && milestones.change_requested && !changeUsed && (
            <ChangeRequestBanner
              onResubmit={() => {
                onMilestoneUpdate(contract.id, {
                  delivery_submitted: false,
                  change_request_used: true,
                });
                setDeliveryLink('');
              }}
            />
          )}
          {accepted && (
            <MilestoneStep
              icon="checkmark-circle"
              label="Cliente aprobó la entrega"
              done
              color="#10b981"
            />
          )}
        </>
      );
    }

    // digital
    return (
      <>
        <MilestoneStep
          icon="cloud-upload-outline"
          label="Entrega digital"
          sublabel={deliveryDone ? `Entregado: ${milestones.delivery_link}` : 'Sube tu archivo o link de entregable'}
          done={deliveryDone && !milestones.change_requested}
          active={!deliveryDone}
          color="#f59e0b"
        />
        {!deliveryDone && (
          <DeliveryInput
            value={deliveryLink}
            onChange={setDeliveryLink}
            onSubmit={handleSubmitDelivery}
            loading={submittingLink}
            changeUsed={changeUsed}
          />
        )}
        {deliveryDone && milestones.change_requested && !changeUsed && (
          <ChangeRequestBanner
            onResubmit={() => {
              onMilestoneUpdate(contract.id, {
                delivery_submitted: false,
                change_request_used: true,
              });
              setDeliveryLink('');
            }}
          />
        )}
        {accepted && (
          <MilestoneStep
            icon="checkmark-circle"
            label="Cliente aprobó la entrega"
            done
            color="#10b981"
          />
        )}
      </>
    );
  };

  // ── Service type badge ─────────────────────────────────────────────────────

  const SERVICE_BADGE: Record<ServiceType, { label: string; color: string; bg: string; icon: string }> = {
    presencial: { label: 'Presencial',  color: '#7c3aed', bg: '#f5f3ff', icon: 'walk-outline' },
    hibrido:    { label: 'Híbrido',     color: '#2563eb', bg: '#eff6ff', icon: 'git-merge-outline' },
    digital:    { label: 'Digital',     color: '#f59e0b', bg: '#fffbeb', icon: 'cloud-outline' },
  };
  const badge = SERVICE_BADGE[service_type];

  return (
    <View style={styles.card}>
      {/* ── Header ── */}
      <LinearGradient
        colors={['#7c3aed', '#4f46e5']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.typeBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name={badge.icon as any} size={12} color="#fff" />
            <Text style={styles.typeBadgeText}>{badge.label}</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.headerSub}>{poster_name}</Text>
        </View>
        {amount ? (
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>{formatCOP(amount)}</Text>
            <Text style={styles.amountLabel}>a cobrar</Text>
          </View>
        ) : null}
      </LinearGradient>

      {/* ── Info row ── */}
      <View style={styles.infoRow}>
        {location ? (
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{location}</Text>
          </View>
        ) : null}
        {date ? (
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{date}</Text>
          </View>
        ) : null}
      </View>

      {/* ── Hitos ── */}
      <View style={styles.milestonesSection}>
        <Text style={styles.sectionLabel}>Progreso del servicio</Text>
        {renderMilestones()}
      </View>

      {/* ── Timer 48h — cierre automático si cliente no responde ── */}
      {timeLeft !== null && timeLeft > 0 && (
        <View style={styles.timerBanner}>
          <Ionicons name="time-outline" size={16} color="#f59e0b" />
          <View style={{ flex: 1 }}>
            <Text style={styles.timerTitle}>
              El cliente tiene <Text style={{ fontFamily: 'PlusJakartaSans_700Bold' }}>{formatTimeLeft(timeLeft)}</Text> para responder
            </Text>
            <Text style={styles.timerSub}>Si no lo hace, la entrega se aprobará automáticamente.</Text>
          </View>
        </View>
      )}

      {/* ── Footer acciones ── */}
      {onMessage && (
        <TouchableOpacity style={styles.messageBtn} onPress={onMessage}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
          <Text style={styles.messageBtnText}>Mensaje al cliente</Text>
        </TouchableOpacity>
      )}

      {/* Modal de código */}
      <CodeEntryModal
        visible={!!codeModal}
        type={codeModal ?? 'arrival'}
        onClose={() => setCodeModal(null)}
        onConfirm={handleCodeConfirm}
      />
    </View>
  );
}

// ── Sub-componente: DeliveryInput ─────────────────────────────────────────────

function DeliveryInput({
  value,
  onChange,
  onSubmit,
  loading,
  changeUsed,
}: {
  value: string;
  onChange: (t: string) => void;
  onSubmit: () => void;
  loading: boolean;
  changeUsed: boolean;
}) {
  return (
    <View style={di.container}>
      <Text style={di.label}>Link / nombre de archivo</Text>
      <TextInput
        style={di.input}
        value={value}
        onChangeText={onChange}
        placeholder="https://drive.google.com/... o nombre del archivo"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="url"
      />
      {changeUsed && (
        <View style={di.warningRow}>
          <Ionicons name="warning-outline" size={13} color="#f59e0b" />
          <Text style={di.warningText}>Este es tu único cambio permitido. Asegúrate antes de enviar.</Text>
        </View>
      )}
      <TouchableOpacity onPress={onSubmit} disabled={loading} style={di.btn} activeOpacity={0.85}>
        <LinearGradient colors={['#f59e0b', '#d97706']} style={di.btnGradient}>
          <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
          <Text style={di.btnText}>{loading ? 'Enviando...' : 'Enviar entregable'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ── Sub-componente: ChangeRequestBanner ──────────────────────────────────────

function ChangeRequestBanner({ onResubmit }: { onResubmit: () => void }) {
  return (
    <View style={cr.banner}>
      <Ionicons name="construct-outline" size={20} color="#f59e0b" />
      <View style={{ flex: 1 }}>
        <Text style={cr.title}>El cliente solicitó un ajuste</Text>
        <Text style={cr.sub}>Recuerda que es la última corrección permitida.</Text>
      </View>
      <TouchableOpacity onPress={onResubmit} style={cr.btn}>
        <Text style={cr.btnText}>Reenviar</Text>
      </TouchableOpacity>
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
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 12,
  },
  headerLeft: { flex: 1, gap: 4 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    lineHeight: 22,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.75)',
  },
  amountBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    minWidth: 72,
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  amountLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  milestonesSection: { padding: 20, gap: 4 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6b7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  messageBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  timerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  timerTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#92400e',
  },
  timerSub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#b45309',
    marginTop: 2,
  },
});

// MilestoneStep styles
const ms = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  leftCol: { alignItems: 'center', width: 28 },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLocked: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#f0f0f0',
    marginTop: 4,
    minHeight: 24,
  },
  body: { flex: 1, paddingBottom: 16, gap: 4 },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#111827',
  },
  labelDone: { color: '#10b981' },
  labelLocked: { color: '#9ca3af' },
  sublabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
  },
  tooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#ef4444',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  actionBtnLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#f9fafb',
  },
  actionTextLocked: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#9ca3af',
  },
});

// DeliveryInput styles
const di = StyleSheet.create({
  container: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400e',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  warningText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#92400e',
    flex: 1,
  },
  btn: { borderRadius: 10, overflow: 'hidden' },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  btnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});

// ChangeRequestBanner styles
const cr = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  title: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#92400e',
  },
  sub: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#78350f',
    marginTop: 1,
  },
  btn: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  btnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
