import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type BalanceTab = 'disponible' | 'pendiente' | 'custodia';

// ── Mock (reemplazar con datos reales) ────────────────────────────────────────

const BALANCE = { disponible: 0, pendiente: 0, custodia: 0 };

const MOCK_TRANSACTIONS: {
  id: string;
  type: string;
  description: string;
  date: string;
  status: 'completado' | 'pendiente' | 'retenido';
  amount: number;
  incoming: boolean;
}[] = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtMoney = (n: number) =>
  `$${n.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;

// ── GlassCard (General) ───────────────────────────────────────────────────────

const GlassCard: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[gc.card, style]}>{children}</View>
);
const gc = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.1)',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
});

// ── Status pill ───────────────────────────────────────────────────────────────

const STATUS_META = {
  completado: { label: 'Completado',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)'  },
  pendiente:  { label: 'Pendiente',   color: '#d97706', bg: 'rgba(217,119,6,0.1)'  },
  retenido:   { label: 'En custodia', color: '#2563eb', bg: 'rgba(37,99,235,0.1)'  },
};

const StatusPill: React.FC<{ status: keyof typeof STATUS_META }> = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <View style={[pl.wrap, { backgroundColor: m.bg }]}>
      <Text style={[pl.text, { color: m.color }]}>{m.label}</Text>
    </View>
  );
};
const pl = StyleSheet.create({
  wrap: { borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  text: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_700Bold' },
});

// ── Transaction Row ───────────────────────────────────────────────────────────

const TxRow: React.FC<{
  type: string;
  description: string;
  date: string;
  status: keyof typeof STATUS_META;
  amount: number;
  incoming: boolean;
  last?: boolean;
}> = ({ type, description, date, status, amount, incoming, last }) => (
  <View style={[tr.row, !last && tr.border]}>
    <View style={[tr.iconWrap, {
      backgroundColor: incoming ? 'rgba(22,163,74,0.1)' : 'rgba(124,58,237,0.08)',
    }]}>
      <Ionicons
        name={incoming ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
        size={20}
        color={incoming ? '#16a34a' : '#7c3aed'}
      />
    </View>
    <View style={tr.center}>
      <Text style={tr.type}>{type}</Text>
      <Text style={tr.desc} numberOfLines={1}>{description}</Text>
      <Text style={tr.date}>{date}</Text>
    </View>
    <View style={tr.right}>
      <Text style={[tr.amount, { color: incoming ? '#16a34a' : '#1e1b4b' }]}>
        {incoming ? '+' : '-'}{fmtMoney(Math.abs(amount))}
      </Text>
      <StatusPill status={status} />
    </View>
  </View>
);

const tr = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 14, paddingHorizontal: 16,
  },
  border: { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  iconWrap: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  center:  { flex: 1, gap: 2 },
  type:    { fontSize: 13.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  desc:    { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8' },
  date:    { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.35)' },
  right:   { alignItems: 'flex-end', gap: 5, flexShrink: 0 },
  amount:  { fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: -0.3 },
});

// ── Empty transacciones ───────────────────────────────────────────────────────

const EmptyTx = () => (
  <View style={et.wrap}>
    <View style={et.iconBox}>
      <Ionicons name="wallet-outline" size={30} color="rgba(124,58,237,0.35)" />
    </View>
    <Text style={et.title}>Sin movimientos aún</Text>
    <Text style={et.sub}>
      Una vez que comiences a ganar, tus transacciones aparecerán aquí.
    </Text>
    <TouchableOpacity style={et.helpBtn}>
      <Ionicons name="help-circle-outline" size={13} color="#7c3aed" />
      <Text style={et.helpText}>¿Necesita ayuda de pago?</Text>
    </TouchableOpacity>
  </View>
);

const et = StyleSheet.create({
  wrap: { 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 24 
  },
  iconBox: {
    width: 58, 
    height: 58, 
    borderRadius: 18,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, 
    borderColor: 'rgba(139,92,246,0.12)',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 14,
  },
  title: { 
    fontSize: 14.5, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: '#1e1b4b', 
    marginBottom: 6 
  },
  sub: {
    fontSize: 12.5, 
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.4)', 
    textAlign: 'center', 
    lineHeight: 18, 
    marginBottom: 18,
  },
  helpBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5,
    paddingHorizontal: 14, 
    paddingVertical: 8,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(124,58,237,0.14)',
  },
  helpText: { 
    fontSize: 12, 
    fontFamily: 'PlusJakartaSans_600SemiBold', 
    color: '#7c3aed' 
  },
});

// ── WalletScreen ──────────────────────────────────────────────────────────────

const TABS: { key: BalanceTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string }[] = [
  { key: 'disponible', label: 'Disponible',  icon: 'checkmark-circle-outline', color: '#16a34a' },
  { key: 'pendiente',  label: 'Pendiente',   icon: 'time-outline',             color: '#d97706' },
  { key: 'custodia',   label: 'En custodia', icon: 'lock-closed-outline',      color: '#2563eb' },
];

export const WalletScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState<BalanceTab>('disponible');

  const filteredTx = MOCK_TRANSACTIONS.filter(t =>
    tab === 'disponible' ? t.status === 'completado'
    : tab === 'pendiente' ? t.status === 'pendiente'
    : t.status === 'retenido'
  );

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#4c1d95" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Mi Wallet</Text>
        <TouchableOpacity style={s.notifBtn}>
          <Ionicons name="notifications-outline" size={20} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── HERO CARD (ESTILO GLASSMORPHISM) ── */}
        <View style={s.heroContainer}>
          <LinearGradient
            colors={['rgba(76, 29, 149, 0.9)', 'rgba(30, 64, 175, 0.85)']} // Colores originales con transparencia
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            {/* Círculos decorativos internos */}
            <View style={s.heroCircle1} />
            <View style={s.heroCircle2} />

            <View style={s.heroTopRow}>
              <View>
                <Text style={s.heroLabel}>Balance disponible</Text>
                <Text style={s.heroAmount}>{fmtMoney(BALANCE.disponible)}</Text>
              </View>
              <TouchableOpacity style={s.addBtn}>
                <Ionicons name="add" size={13} color="#7c3aed" />
                <Text style={s.addBtnText}>Añadir cuenta</Text>
              </TouchableOpacity>
            </View>

            <View style={s.heroDivider} />

            <View style={s.heroStats}>
              {TABS.map((t, i) => (
                <View key={t.key} style={[s.heroStat, i < 2 && s.heroStatBorder]}>
                  <Text style={[s.heroStatVal, { color: t.color === '#16a34a' ? '#86efac' : t.color === '#d97706' ? '#fcd34d' : '#93c5fd' }]}>
                    {fmtMoney(BALANCE[t.key])}
                  </Text>
                  <Text style={s.heroStatLabel}>{t.label}</Text>
                </View>
              ))}
            </View>

            <View style={s.heroHint}>
              <Ionicons name="information-circle-outline" size={12} color="rgba(255,255,255,0.4)" />
              <Text style={s.heroHintText}>
                Agrega una cuenta para recibir comisión de pago gratis
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── RETIRAR FONDOS ── */}
        <GlassCard style={s.withdrawCard}>
          <View style={s.withdrawLeft}>
            <View style={s.withdrawIconWrap}>
              <Ionicons name="download-outline" size={18} color="#7c3aed" />
            </View>
            <View>
              <Text style={s.withdrawTitle}>Retirar fondos</Text>
              <Text style={s.withdrawSub}>Transferir a tu cuenta bancaria</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="rgba(124,58,237,0.3)" />
        </GlassCard>

        {/* ── TABS ── */}
        <View style={s.tabsRow}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                activeOpacity={0.75}
                style={[
                  s.tabCard,
                  active && { borderColor: t.color + '35', borderBottomColor: t.color },
                ]}
              >
                <Ionicons
                  name={t.icon}
                  size={14}
                  color={active ? t.color : 'rgba(109,40,217,0.25)'}
                />
                <Text style={[s.tabLabel, active && { color: t.color, fontFamily: 'PlusJakartaSans_700Bold' }]}>
                  {t.label}
                </Text>
                <Text style={[s.tabAmt, active && { color: t.color }]}>
                  {fmtMoney(BALANCE[t.key])}
                </Text>
                {active && <View style={[s.tabLine, { backgroundColor: t.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── LISTA TRANSACCIONES ── */}
        <GlassCard style={{ overflow: 'hidden' }}>
          <View style={s.listHeader}>
            <Text style={s.listCount}>{filteredTx.length} transacciones</Text>
            <TouchableOpacity style={s.filterBtn}>
              <Ionicons name="filter-outline" size={13} color="#7c3aed" />
              <Text style={s.filterTxt}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          <View style={s.listDivider} />
          {filteredTx.length > 0 ? (
            filteredTx.map((t, i) => (
              <TxRow
                key={t.id}
                type={t.type}
                description={t.description}
                date={t.date}
                status={t.status}
                amount={t.amount}
                incoming={t.incoming}
                last={i === filteredTx.length - 1}
              />
            ))
          ) : (
            <EmptyTx />
          )}
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 30 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.1)',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#faf5ff',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4c1d95', textAlign: 'center',
  },
  notifBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Hero Card con Efecto Espejo/Glass
  heroContainer: {
    marginBottom: 14,
    borderRadius: 22,
    // Sombra exterior para que resalte (Efecto Elevado)
    shadowColor: '#4c1d95',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  hero: {
    borderRadius: 22, 
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Borde blanco sutil tipo cristal
  },
  heroCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -60, right: -40,
  },
  heroCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: 10,
  },
  heroTopRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 16,
  },
  heroLabel: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.7)', marginBottom: 4,
  },
  heroAmount: {
    fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff', letterSpacing: -1,
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', borderRadius: 22,
    paddingHorizontal: 13, paddingVertical: 8,
  },
  addBtnText: { fontSize: 11.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 14 },
  heroStats: { flexDirection: 'row', marginBottom: 14 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatBorder: {
    borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)',
  },
  heroStatVal: {
    fontSize: 13.5, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: -0.3,
  },
  heroStatLabel: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.5)', marginTop: 2,
  },
  heroHint: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroHintText: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.5)', flex: 1,
  },

  // Otros estilos (Se mantienen iguales a tu diseño original)
  withdrawCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 14, marginBottom: 16,
  },
  withdrawLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  withdrawIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  withdrawTitle: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  withdrawSub: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.4)', marginTop: 1,
  },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabCard: {
    flex: 1, alignItems: 'center', gap: 3,
    paddingVertical: 11, paddingHorizontal: 4,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(139,92,246,0.1)',
    position: 'relative', overflow: 'hidden',
  },
  tabLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.3)', textAlign: 'center',
  },
  tabAmt: {
    fontSize: 11.5, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: 'rgba(109,40,217,0.2)', letterSpacing: -0.3,
  },
  tabLine: {
    position: 'absolute', bottom: 0, left: 10, right: 10,
    height: 2.5, borderRadius: 2,
  },
  listHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  listCount: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.4)',
  },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  filterTxt: { fontSize: 11.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  listDivider: {
    height: 1, backgroundColor: 'rgba(139,92,246,0.07)', marginHorizontal: 16,
  },
});