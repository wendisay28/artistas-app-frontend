import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useStripeOnboarding } from '../../StripeOnboardingContext';
import { stripeService } from '../../../../../services/api/stripe.service';
import FadeIn from '../FadeIn';

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

const AjustesTab = ({ onNewComprobante }: { onNewComprobante?: () => void }) => {
  const { setStep } = useStripeOnboarding();

  const openStripe = async () => {
    try {
      const { dashboardUrl } = await stripeService.getDashboardLink();
      await WebBrowser.openBrowserAsync(dashboardUrl);
    } catch {
      Alert.alert('Error', 'No se pudo abrir Stripe. Intenta de nuevo.');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Desconectar cuenta',
      '¿Estás seguro? Esto desactivará tu capacidad de recibir pagos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar', style: 'destructive',
          onPress: async () => {
            try { await stripeService.disconnect(); setStep('welcome'); }
            catch { Alert.alert('Error', 'No se pudo desconectar la cuenta.'); }
          },
        },
      ]
    );
  };

  const SETTINGS = [
    { icon: 'open-outline' as const,  color: '#7c3aed', label: 'Ver portal de Stripe', sub: 'Gestiona tu cuenta directamente',  onPress: openStripe },
    { icon: 'card-outline' as const,  color: '#2563eb', label: 'Configurar banco',      sub: 'Cuenta de destino para retiros',   onPress: openStripe },
    { icon: 'send-outline' as const,  color: '#059669', label: 'Nuevo comprobante',      sub: 'Genera y comparte con tu cliente', onPress: onNewComprobante ?? openStripe },
  ];

  return (
    <FadeIn delay={150}>
      <View style={s.wrap}>
        <GlassCard style={{ overflow: 'hidden' }}>
          <View style={s.listHeader}>
            <Text style={s.listTitle}>Configuración</Text>
          </View>
          <View style={s.divider} />
          {SETTINGS.map((item, i) => (
            <TouchableOpacity key={i} onPress={item.onPress} activeOpacity={0.75}
              style={[s.row, i < SETTINGS.length - 1 && s.rowBorder]}>
              <View style={[s.icon, { backgroundColor: item.color + '12' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={s.center}>
                <Text style={s.rowTitle}>{item.label}</Text>
                <Text style={s.rowSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(124,58,237,0.3)" />
            </TouchableOpacity>
          ))}
        </GlassCard>

        <TouchableOpacity onPress={handleDisconnect} activeOpacity={0.8} style={s.disconnect}>
          <Ionicons name="unlink-outline" size={15} color="#ef4444" />
          <Text style={s.disconnectText}>Desconectar cuenta Stripe</Text>
        </TouchableOpacity>
      </View>
    </FadeIn>
  );
};

export default AjustesTab;

const s = StyleSheet.create({
  wrap:          { gap: 14 },
  listHeader:    { paddingHorizontal: 16, paddingVertical: 12 },
  listTitle:     { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.4)' },
  divider:       { height: 1, backgroundColor: 'rgba(139,92,246,0.07)', marginHorizontal: 16 },
  row:           { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  rowBorder:     { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  icon:          { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  center:        { flex: 1 },
  rowTitle:      { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  rowSub:        { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8', marginTop: 1 },
  disconnect:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.15)' },
  disconnectText:{ fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#ef4444' },
});
