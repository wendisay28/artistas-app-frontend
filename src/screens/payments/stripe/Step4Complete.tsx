// src/screens/payments/stripe/Step4Complete.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Easing, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStripeOnboarding } from './StripeOnboardingContext';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'pagada' | 'pendiente' | 'borrador';
type PortalTab = 'resumen' | 'facturas' | 'ajustes';

const STATUS_META: Record<InvoiceStatus, { color: string; bg: string; label: string }> = {
  pagada:    { color: '#16a34a', bg: 'rgba(22,163,74,0.1)',    label: 'Pagada'    },
  pendiente: { color: '#d97706', bg: 'rgba(217,119,6,0.1)',    label: 'Pendiente' },
  borrador:  { color: '#6b7280', bg: 'rgba(107,114,128,0.1)',  label: 'Borrador'  },
};

const MOCK_INVOICES: {
  num: string; client: string; amount: string;
  status: InvoiceStatus; date: string;
}[] = [
  { num: '001', client: 'Juan García',  amount: '$350.000', status: 'pagada',    date: 'Mar 1' },
  { num: '002', client: 'María López',  amount: '$280.000', status: 'pendiente', date: 'Mar 3' },
  { num: '003', client: 'Carlos Ruiz',  amount: '$120.000', status: 'borrador',  date: 'Mar 5' },
];

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
  delay = 0, children, style,
}) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 480, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 480, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [delay]);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
};

// ── Segmented Progress Bar ────────────────────────────────────────────────────

const SegmentedBar: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <View style={pb.row}>
    {Array.from({ length: total }).map((_, i) => {
      const done = i < step - 1, active = i === step - 1;
      return (
        <View key={i} style={pb.seg}>
          {done   ? <LinearGradient colors={['#7c3aed','#5b21b6']} start={{x:0,y:0}} end={{x:1,y:0}} style={pb.fill}/> :
           active ? <LinearGradient colors={['#7c3aed','#2563eb']} start={{x:0,y:0}} end={{x:1,y:0}} style={pb.fill}/> :
                    <View style={pb.empty}/>}
        </View>
      );
    })}
  </View>
);

const pb = StyleSheet.create({
  row:   { flexDirection:'row', paddingHorizontal:20, gap:5 },
  seg:   { flex:1, height:4, borderRadius:4, overflow:'hidden' },
  fill:  { flex:1 },
  empty: { flex:1, backgroundColor:'rgba(124,58,237,0.1)', borderRadius:4 },
});

// ── InvoiceRow ────────────────────────────────────────────────────────────────

const InvoiceRow: React.FC<{
  num: string; client: string; amount: string;
  status: InvoiceStatus; date: string; last?: boolean;
}> = ({ num, client, amount, status, date, last }) => {
  const s = STATUS_META[status];
  return (
    <View style={[ir.row, !last && ir.border]}>
      <View style={ir.iconWrap}>
        <Ionicons name="document-text-outline" size={16} color="#7c3aed" />
      </View>
      <View style={ir.center}>
        <Text style={ir.num}>Factura #{num}</Text>
        <Text style={ir.meta}>{client} · {date}</Text>
      </View>
      <View style={ir.right}>
        <Text style={ir.amount}>{amount}</Text>
        <View style={[ir.pill, { backgroundColor: s.bg }]}>
          <Text style={[ir.pillText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>
    </View>
  );
};

const ir = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  border:  { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  iconWrap:{
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  center:  { flex: 1, gap: 2 },
  num:     { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  meta:    { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8' },
  right:   { alignItems: 'flex-end', gap: 4 },
  amount:  { fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.3 },
  pill:    { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  pillText:{ fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
});

// ── Componente Principal ─────────────────────────────────────────────────────

const Step4Complete = () => {
  const { state, setStep } = useStripeOnboarding();
  const [activeTab, setActiveTab] = useState<PortalTab>('resumen');

  const handleDisconnect = () => {
    Alert.alert(
      'Desconectar cuenta',
      '¿Estás seguro de que quieres desconectar tu cuenta Stripe? Esto afectará tu capacidad de recibir pagos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar', style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica de desconexión
            setStep('welcome');
          },
        },
      ]
    );
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <FadeIn delay={0}>
        <View style={s.header}>
          <Text style={s.stepCounter}>
            Paso <Text style={s.stepCounterBold}>4</Text> de 4
          </Text>
        </View>
      </FadeIn>

      {/* Barra de progreso */}
      <FadeIn delay={50}>
        <View style={s.barWrap}>
          <SegmentedBar step={4} total={4} />
          <Text style={s.stepLabel}>Completado</Text>
        </View>
      </FadeIn>

      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {/* Hero de éxito */}
        <FadeIn delay={100}>
          <LinearGradient
            colors={['rgba(124,58,237,0.95)', 'rgba(37,99,235,0.9)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            {/* Efecto glassmorphism */}
            <View style={s.glassOverlay} />
            <View style={s.glassHighlight} />
            
            {/* Círculos decorativos */}
            <View style={s.heroCircle1} />
            <View style={s.heroCircle2} />
            <View style={s.heroCircle3} />

            <View style={s.heroTop}>
              <View style={s.heroIconWrap}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.heroTitle}>Cuenta conectada</Text>
                <Text style={s.heroSub}>
                  {state.connectionStatus.chargesEnabled ? 'Puedes recibir pagos' : 'Configuración pendiente'}
                </Text>
              </View>
              <View style={s.activePill}>
                <View style={s.activeDot} />
                <Text style={s.activeText}>Activo</Text>
              </View>
            </View>

            <View style={s.heroDivider} />

            {/* Stats */}
            <View style={s.statsRow}>
              {[
                { label: 'Balance',  value: '$0.00' },
                { label: 'Facturas', value: String(MOCK_INVOICES.length) },
                { label: 'Pagos',    value: '$0.00' },
              ].map((item, i) => (
                <View key={i} style={[s.stat, i < 2 && s.statBorder]}>
                  <Text style={s.statVal}>{item.value}</Text>
                  <Text style={s.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </FadeIn>

        {/* Tabs del portal */}
        <FadeIn delay={150}>
          <View style={s.tabsWrap}>
            {(['resumen', 'facturas', 'ajustes'] as PortalTab[]).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[s.tab, activeTab === t && s.tabActive]}
                activeOpacity={0.75}
              >
                <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
                {activeTab === t && (
                  <LinearGradient
                    colors={['#7c3aed', '#2563eb']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={s.tabLine}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </FadeIn>

        {/* ── Resumen ── */}
        {activeTab === 'resumen' && (
          <FadeIn delay={200}>
            <View style={{ gap: 10, paddingHorizontal: 16, paddingBottom: 8 }}>
              {[
                { icon: 'checkmark-circle-outline' as const, color: '#16a34a', label: 'Cobros habilitados',  sub: 'Puedes recibir pagos de clientes'                         },
                { icon: 'shield-checkmark-outline' as const, color: '#2563eb', label: 'Fondos en custodia',  sub: 'Stripe protege tu dinero hasta completar el servicio'      },
                { icon: 'cash-outline'             as const, color: '#7c3aed', label: 'Retiros disponibles', sub: 'Transfiere a tu cuenta bancaria cuando quieras'            },
              ].map((item, i) => (
                <View key={i} style={s.resCard}>
                  <View style={[s.resIcon, { backgroundColor: item.color + '18' }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.resTitle}>{item.label}</Text>
                    <Text style={s.resSub}>{item.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </FadeIn>
        )}

        {/* ── Facturas ── */}
        {activeTab === 'facturas' && (
          <FadeIn delay={200}>
            <View style={s.invoiceCard}>
              <View style={s.invoiceHeader}>
                <Text style={s.invoiceCount}>{MOCK_INVOICES.length} facturas</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#7c3aed', '#2563eb']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={s.newInvoiceBtn}
                  >
                    <Ionicons name="add" size={13} color="#fff" />
                    <Text style={s.newInvoiceText}>Nueva factura</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {MOCK_INVOICES.map((inv, i) => (
                <InvoiceRow
                  key={inv.num}
                  {...inv}
                  last={i === MOCK_INVOICES.length - 1}
                />
              ))}
            </View>
          </FadeIn>
        )}

        {/* ── Ajustes ── */}
        {activeTab === 'ajustes' && (
          <FadeIn delay={200}>
            <View style={{ gap: 10, paddingHorizontal: 16, paddingBottom: 8 }}>
              <View style={s.settingsCard}>
                {[
                  { icon: 'open-outline'         as const, color: '#7c3aed', label: 'Ver portal de Stripe', sub: 'Gestiona tu cuenta directamente'   },
                  { icon: 'card-outline'         as const, color: '#2563eb', label: 'Configurar banco',     sub: 'Cuenta de destino para retiros'     },
                  { icon: 'send-outline'         as const, color: '#059669', label: 'Enviar factura',       sub: 'Crea y envía a tu cliente'          },
                ].map((item, i, arr) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.75}
                    style={[s.settingsRow, i < arr.length - 1 && s.settingsRowBorder]}
                  >
                    <View style={[s.settingsIcon, { backgroundColor: item.color + '12' }]}>
                      <Ionicons name={item.icon} size={16} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.settingsLabel}>{item.label}</Text>
                      <Text style={s.settingsSub}>{item.sub}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="rgba(124,58,237,0.3)" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={handleDisconnect} activeOpacity={0.8} style={s.disconnectBtn}>
                <Ionicons name="unlink-outline" size={15} color="#ef4444" />
                <Text style={s.disconnectText}>Desconectar cuenta Stripe</Text>
              </TouchableOpacity>
            </View>
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
};

export default Step4Complete;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
  },
  logoRow:         { flexDirection: 'row', alignItems: 'center', gap: 0 },
  logoBusca:       { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg:       { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 },
  logoArt:         { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  stepCounter:     { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Barra
  barWrap:   { gap: 8, paddingBottom: 4 },
  stepLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)', paddingHorizontal: 20,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Hero
  hero: { 
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, padding: 20, overflow: 'hidden', position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glassHighlight: {
    position: 'absolute', top: 0, left: 1, right: 1, height: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  heroCircle: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -30,
  },
  heroCircle1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -30,
  },
  heroCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)', bottom: -20, left: 10,
  },
  heroCircle3: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.02)', top: '30%', right: 20,
  },
  heroTop:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  heroIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle:  { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  heroSub:    { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(134,239,172,0.3)',
  },
  activeDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: '#86efac' },
  activeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: '#86efac' },
  heroDivider:{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 14 },
  statsRow:   { flexDirection: 'row' },
  stat:       { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
  statVal:    { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.3 },
  statLabel:  { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.45)', marginTop: 2 },

  // Tabs
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)',
    marginHorizontal: 16, marginBottom: 14,
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  tab:         { flex: 1, alignItems: 'center', paddingVertical: 13, position: 'relative' },
  tabActive:   {},
  tabText:     { fontSize: 12.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.35)' },
  tabTextActive:{ fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  tabLine:     { position: 'absolute', bottom: 0, left: 12, right: 12, height: 2.5, borderRadius: 2 },

  // Resumen
  resCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)',
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  resIcon:  { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  resTitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  resSub:   { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8', marginTop: 1 },

  // Facturas
  invoiceCard: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)',
    overflow: 'hidden', marginHorizontal: 16, marginBottom: 8,
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  invoiceHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)',
  },
  invoiceCount:   { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(109,40,217,0.4)' },
  newInvoiceBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  newInvoiceText: { fontSize: 11.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  // Ajustes
  settingsCard: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)', overflow: 'hidden',
  },
  settingsRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  settingsIcon:      { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  settingsLabel:     { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  settingsSub:       { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8', marginTop: 1 },

  disconnectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 14,
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.15)',
  },
  disconnectText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#ef4444' },
});
