import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useStripeOnboarding } from '../StripeOnboardingContext';
import { stripeService } from '../../../../services/api/stripe.service';

const HeroCard = () => {
  const { state } = useStripeOnboarding();

  const openDashboard = async () => {
    try {
      const { dashboardUrl } = await stripeService.getDashboardLink();
      await WebBrowser.openBrowserAsync(dashboardUrl);
    } catch {
      Alert.alert('Error', 'No se pudo abrir Stripe. Intenta de nuevo.');
    }
  };

  return (
    <View style={s.container}>
      <LinearGradient
        colors={['rgba(76,29,149,0.9)', 'rgba(30,64,175,0.85)']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={s.circle1} />
        <View style={s.circle2} />

        <View style={s.topRow}>
          <View style={s.iconWrap}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Cuenta conectada</Text>
            <Text style={s.sub}>
              {state.connectionStatus.chargesEnabled ? 'Puedes recibir pagos' : 'Configuración pendiente'}
            </Text>
          </View>
          <View style={s.activePill}>
            <View style={s.dot} />
            <Text style={s.activeText}>Activo</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.bottomRow}>
          <Ionicons name="shield-checkmark-outline" size={12} color="rgba(255,255,255,0.4)" />
          <Text style={s.hint}>Stripe Connect activo · Pagos protegidos</Text>
          <TouchableOpacity onPress={openDashboard} style={s.stripeBtn} activeOpacity={0.85}>
            <Ionicons name="open-outline" size={11} color="#7c3aed" />
            <Text style={s.stripeBtnText}>Ver en Stripe</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default HeroCard;

const s = StyleSheet.create({
  container: {
    marginBottom: 14,
    borderRadius: 22,
    shadowColor: '#4c1d95', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 15, elevation: 8,
  },
  hero: {
    borderRadius: 22, padding: 20, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  circle1:   { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', top: -60, right: -40 },
  circle2:   { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: 10 },
  topRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconWrap:  { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  title:     { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  sub:       { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  activePill:{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(134,239,172,0.3)' },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#86efac' },
  activeText:{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#86efac' },
  divider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 14 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hint:      { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.5)', flex: 1 },
  stripeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  stripeBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
});
