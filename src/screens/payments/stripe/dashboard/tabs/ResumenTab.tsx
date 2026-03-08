import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FadeIn from '../FadeIn';
import { stripeService, StripeConnectionStatus } from '../../../../../services/api/stripe.service';
import { useStripeOnboarding } from '../../StripeOnboardingContext';

const GlassCard: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[gc.card, style]}>{children}</View>
);
const gc = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)',
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
});

const STATUS_CONFIG: Record<string, { icon: 'checkmark-circle-outline' | 'timer-outline' | 'alert-circle-outline'; color: string; label: string }> = {
  connected:    { icon: 'checkmark-circle-outline', color: '#16a34a', label: 'Cuenta activa' },
  pending:      { icon: 'timer-outline',            color: '#d97706', label: 'En verificación' },
  restricted:   { icon: 'alert-circle-outline',     color: '#dc2626', label: 'Acción requerida' },
  disconnected: { icon: 'alert-circle-outline',     color: '#6b7280', label: 'Sin conectar' },
};

const ResumenTab = () => {
  const { updateConnectionStatus } = useStripeOnboarding();
  const [loading, setLoading]     = useState(false);
  const [status,  setStatus]      = useState<StripeConnectionStatus | null>(null);
  const [error,   setError]       = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await stripeService.getConnectionStatus();
      setStatus(data);
      updateConnectionStatus(data);
    } catch {
      setError('No se pudo actualizar. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  const cfg = STATUS_CONFIG[status?.status ?? 'disconnected'];

  const ITEMS = [
    {
      icon:  'checkmark-circle-outline' as const,
      color: status?.chargesEnabled ? '#16a34a' : '#94a3b8',
      label: 'Cobros habilitados',
      sub:   status?.chargesEnabled
        ? 'Puedes recibir pagos de clientes'
        : 'Completa la verificación para activar',
    },
    {
      icon:  'shield-checkmark-outline' as const,
      color: '#2563eb',
      label: 'Fondos en custodia',
      sub:   'Stripe protege tu dinero hasta completar el servicio',
    },
    {
      icon:  'cash-outline' as const,
      color: status?.payoutsEnabled ? '#7c3aed' : '#94a3b8',
      label: 'Retiros disponibles',
      sub:   status?.payoutsEnabled
        ? 'Transfiere a tu cuenta bancaria cuando quieras'
        : 'Se activan tras verificación completa',
    },
  ];

  return (
    <FadeIn delay={150}>
      <GlassCard style={{ overflow: 'hidden' }}>
        <View style={s.listHeader}>
          <Text style={s.listTitle}>Estado de cuenta</Text>
          <TouchableOpacity style={s.filterBtn} onPress={refresh} disabled={loading}>
            {loading
              ? <ActivityIndicator size={13} color="#7c3aed" />
              : <Ionicons name="refresh-outline" size={13} color="#7c3aed" />
            }
            <Text style={s.filterTxt}>Actualizar</Text>
          </TouchableOpacity>
        </View>

        {/* Banner de estado */}
        {status && (
          <View style={[s.statusBanner, { borderColor: cfg.color + '30', backgroundColor: cfg.color + '08' }]}>
            <Ionicons name={cfg.icon} size={16} color={cfg.color} />
            <Text style={[s.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
            {status.requirements && status.requirements.length > 0 && (
              <Text style={s.statusReq}>{status.requirements.length} requisito(s) pendiente(s)</Text>
            )}
          </View>
        )}

        {error ? (
          <View style={s.errorRow}>
            <Ionicons name="warning-outline" size={13} color="#dc2626" />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={s.divider} />

        {ITEMS.map((item, i) => (
          <View key={i} style={[s.row, i < ITEMS.length - 1 && s.rowBorder]}>
            <View style={[s.icon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{item.label}</Text>
              <Text style={s.rowSub}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </GlassCard>
    </FadeIn>
  );
};

export default ResumenTab;

const s = StyleSheet.create({
  listHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  listTitle:    { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.4)' },
  filterBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(124,58,237,0.07)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  filterTxt:    { fontSize: 11.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, borderRadius: 10, borderWidth: 1, padding: 10 },
  statusLabel:  { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', flex: 1 },
  statusReq:    { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#dc2626' },
  errorRow:     { flexDirection: 'row', gap: 6, alignItems: 'center', marginHorizontal: 16, marginBottom: 8 },
  errorText:    { fontSize: 11, color: '#dc2626', fontFamily: 'PlusJakartaSans_400Regular' },
  divider:      { height: 1, backgroundColor: 'rgba(139,92,246,0.07)', marginHorizontal: 16 },
  row:          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  rowBorder:    { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  icon:         { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowTitle:     { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  rowSub:       { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8', marginTop: 1 },
});
