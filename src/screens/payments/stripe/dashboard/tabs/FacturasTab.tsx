import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FadeIn from '../FadeIn';
import { stripeService, ComprobanteRecord } from '../../../../../services/api/stripe.service';

// ── Types & Data ──────────────────────────────────────────────────────────────

type FilterType = 'todas' | 'pendientes' | 'solicitadas' | 'enviadas';

type Status = 'completado' | 'pendiente' | 'borrador';

export type Comprobante = {
  num: string;
  client: string;
  clientNit: string;
  clientEmail: string;
  clientCity: string;
  emitter: string;
  emitterNit: string;
  emitterType: string;
  description: string;
  amount: number;
  taxRate: number;
  currency: string;
  status: Status;
  date: string;
  filterType: FilterType;
};

const FILTER_META: Record<Exclude<FilterType, 'todas'>, { label: string; color: string; bg: string; dot: string }> = {
  pendientes:  { label: 'Pendientes',  color: '#d97706', bg: 'rgba(217,119,6,0.1)',    dot: '#f59e0b' },
  solicitadas: { label: 'Solicitadas', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)',   dot: '#7c3aed' },
  enviadas:    { label: 'Enviados',    color: '#16a34a', bg: 'rgba(22,163,74,0.1)',    dot: '#16a34a' },
};

const STATUS_META: Record<Status, { label: string; color: string; bg: string; dot: string }> = {
  completado: { label: 'Completado', color: '#16a34a', bg: 'rgba(22,163,74,0.1)',    dot: '#16a34a' },
  pendiente:  { label: 'Pendiente',  color: '#d97706', bg: 'rgba(217,119,6,0.1)',    dot: '#f59e0b' },
  borrador:   { label: 'Borrador',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)',  dot: '#9ca3af' },
};

const ALL_FILTERS: FilterType[] = ['todas', 'pendientes', 'solicitadas', 'enviadas'];

const mapRecord = (r: ComprobanteRecord): Comprobante => ({
  num:         String(r.id).padStart(3, '0'),
  client:      r.client,
  clientNit:   r.clientNit,
  clientEmail: r.clientEmail ?? '',
  clientCity:  r.clientCity,
  emitter:     r.emitter,
  emitterNit:  r.emitterNit,
  emitterType: r.emitterType,
  description: r.description,
  amount:      Number(r.amount),
  taxRate:     r.taxRate ?? 0,
  currency:    r.currency ?? 'COP',
  status:      (r.status as Status) ?? 'borrador',
  date:        new Date(r.createdAt).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
  filterType:  r.status === 'completado' ? 'enviadas' : 'pendientes',
});

const fmtMoney = (n: number) =>
  `$${n.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;

// ── Filter Pills ──────────────────────────────────────────────────────────────

const FilterPills = ({
  active, onChange,
}: { active: FilterType; onChange: (f: FilterType) => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={fp.scroll} contentContainerStyle={fp.content}>
    {ALL_FILTERS.map(f => {
      const isActive = f === active;
      const meta = f !== 'todas' ? FILTER_META[f] : null;
      return (
        <TouchableOpacity
          key={f}
          onPress={() => onChange(f)}
          activeOpacity={0.7}
          style={[fp.pill, isActive && fp.pillActive, isActive && meta && { backgroundColor: meta.bg, borderColor: meta.color + '40' }]}
        >
          {meta && <View style={[fp.dot, { backgroundColor: isActive ? meta.dot : '#cbd5e1' }]} />}
          <Text style={[fp.label, isActive && { color: meta ? meta.color : '#7c3aed', fontFamily: 'PlusJakartaSans_700Bold' }]}>
            {f === 'todas' ? 'Todas' : meta!.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const fp = StyleSheet.create({
  scroll:      { marginBottom: 10 },
  content:     { gap: 7, paddingHorizontal: 0, paddingBottom: 2 },
  pill:        { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.05)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)' },
  pillActive:  { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.25)' },
  dot:         { width: 5, height: 5, borderRadius: 3 },
  label:       { fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium', color: '#94a3b8' },
});

// ── Comprobante Row ───────────────────────────────────────────────────────────

const ComprobanteRow = ({
  client, amount, status, num, description, last, onPress,
}: Comprobante & { last?: boolean; onPress: () => void }) => {
  const m = STATUS_META[status];
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  return (
    <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
      <Animated.View style={[ir.row, !last && ir.border, { transform: [{ scale }] }]}>
        <View style={ir.iconWrap}>
          <Ionicons name="shield-checkmark-outline" size={19} color="#7c3aed" />
        </View>
        <View style={ir.center}>
          <Text style={ir.type}>Comprobante #{num}</Text>
          <Text style={ir.desc} numberOfLines={1}>{client}</Text>
          <Text style={ir.date}>{description}</Text>
        </View>
        <View style={ir.right}>
          <Text style={ir.amount}>{fmtMoney(amount)}</Text>
          <View style={[ir.pill, { backgroundColor: m.bg }]}>
            <View style={[ir.pillDot, { backgroundColor: m.dot }]} />
            <Text style={[ir.pillText, { color: m.color }]}>{m.label}</Text>
          </View>
        </View>
        <View style={{ marginLeft: 4 }}>
          <Ionicons name="chevron-forward" size={14} color="rgba(124,58,237,0.2)" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ir = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13, paddingHorizontal: 16 },
  border:   { borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.07)' },
  iconWrap: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(124,58,237,0.08)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  center:   { flex: 1, gap: 2 },
  type:     { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f172a' },
  desc:     { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8' },
  date:     { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.35)' },
  right:    { alignItems: 'flex-end', gap: 5, flexShrink: 0 },
  amount:   { fontSize: 13.5, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.3 },
  pill:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  pillDot:  { width: 4, height: 4, borderRadius: 2 },
  pillText: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold' },
});

// ── Empty / Error States ──────────────────────────────────────────────────────

const EmptyComprobantes = ({ filtered, error, onRetry }: { filtered: boolean; error?: string; onRetry?: () => void }) => (
  <View style={e.wrap}>
    <View style={e.iconBox}>
      <Ionicons name={error ? 'warning-outline' : filtered ? 'search-outline' : 'shield-checkmark-outline'} size={26} color={error ? '#ef4444' : 'rgba(124,58,237,0.35)'} />
    </View>
    <Text style={[e.title, error && { color: '#ef4444' }]}>
      {error ? 'Error al cargar' : filtered ? 'Sin resultados' : 'Sin comprobantes aún'}
    </Text>
    <Text style={e.sub}>
      {error
        ? error
        : filtered
          ? 'Intenta con otro filtro.'
          : 'Genera tu primer comprobante de contratación.'}
    </Text>
    {error && onRetry && (
      <TouchableOpacity onPress={onRetry} style={e.retryBtn}>
        <Text style={e.retryText}>Reintentar</Text>
      </TouchableOpacity>
    )}
  </View>
);

const e = StyleSheet.create({
  wrap:     { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  iconBox:  { width: 54, height: 54, borderRadius: 17, backgroundColor: 'rgba(124,58,237,0.07)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title:    { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 5 },
  sub:      { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.4)', textAlign: 'center', lineHeight: 18 },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 10 },
  retryText:{ fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
});

// ── Main Component ────────────────────────────────────────────────────────────

const FacturasTab = ({ onSelect }: { onSelect: (c: Comprobante) => void }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('todas');
  const [data,    setData]    = useState<Comprobante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetchComprobantes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: records } = await stripeService.getComprobantes();
      setData(records.map(mapRecord));
    } catch {
      setError('No se pudieron cargar los comprobantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComprobantes(); }, [fetchComprobantes]);

  const filtered = data.filter(c => activeFilter === 'todas' || c.filterType === activeFilter);

  return (
    <FadeIn delay={150}>
      <View style={s.card}>
        <View style={s.header}>
          <View>
            <Text style={s.title}>Comprobantes</Text>
            <Text style={s.count}>{loading ? '—' : `${data.length} en total`}</Text>
          </View>
          <TouchableOpacity onPress={fetchComprobantes} disabled={loading} style={s.refreshBtn}>
            {loading
              ? <ActivityIndicator size={12} color="#7c3aed" />
              : <Ionicons name="refresh-outline" size={14} color="#7c3aed" />
            }
          </TouchableOpacity>
        </View>

        <View style={s.bodyPad}>
          <FilterPills active={activeFilter} onChange={setActiveFilter} />
        </View>

        <View style={s.divider} />

        {loading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size={28} color="rgba(124,58,237,0.4)" />
          </View>
        ) : error ? (
          <EmptyComprobantes filtered={false} error={error} onRetry={fetchComprobantes} />
        ) : filtered.length > 0 ? (
          filtered.map((c, i) => (
            <ComprobanteRow
              key={c.num}
              {...c}
              last={i === filtered.length - 1}
              onPress={() => onSelect(c)}
            />
          ))
        ) : (
          <EmptyComprobantes filtered={activeFilter !== 'todas'} />
        )}
      </View>
    </FadeIn>
  );
};

export default FacturasTab;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  card:       { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)', overflow: 'hidden', shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 },
  title:      { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.3 },
  count:      { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.4)', marginTop: 1 },
  refreshBtn: { padding: 6, backgroundColor: 'rgba(124,58,237,0.07)', borderRadius: 10 },
  bodyPad:    { paddingHorizontal: 16, paddingBottom: 4 },
  divider:    { height: 1, backgroundColor: 'rgba(139,92,246,0.07)' },
});
