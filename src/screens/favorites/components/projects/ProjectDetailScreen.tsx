// ─────────────────────────────────────────────────────────────────────────────
// ProjectDetailScreen.tsx — Vista detalle de proyecto
// Resumen de inversión + precios editables + filtros compactos
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Modal, Alert, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListsStore, type Project } from './Listsstore';
import { useInspirationStore, type InspirationPost } from '../../../../store/inspirationStore';
import type { ExploreCard } from '../../../../types/explore';
import { useThemeStore } from '../../../../store/themeStore';
import { servicesService } from '../../../../services/api/services';

const TYPE_COLORS: Record<string, [string, string]> = {
  artist:  ['#7c3aed', '#2563eb'],
  event:   ['#db2777', '#f59e0b'],
  venue:   ['#059669', '#0ea5e9'],
  gallery: ['#d97706', '#ef4444'],
  own:     ['#059669', '#10b981'],
};

const TYPE_LABELS: Record<string, string> = {
  artist:  'Artista',
  event:   'Evento',
  venue:   'Sala',
  gallery: 'Galería',
  own:     'Inspiración',
};

const TYPE_DOT: Record<string, string> = {
  artist:  '#a78bfa',
  event:   '#60a5fa',
  venue:   '#34d399',
  gallery: '#f472b6',
  own:     '#34d399',
};

const FILTERS = [
  { key: 'all',     label: 'Todos' },
  { key: 'artist',  label: 'Artistas' },
  { key: 'event',   label: 'Eventos' },
  { key: 'venue',   label: 'Salas' },
  { key: 'gallery', label: 'Galería' },
  { key: 'own',     label: 'Inspiración' },
];

// Tipo unificado para la lista
type ListItem =
  | { kind: 'card';        data: ExploreCard }
  | { kind: 'inspiration'; data: InspirationPost };

const formatCOP = (n: number) =>
  `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// Cache compartido de servicios (igual que ArtistCard en Favoritos)
const _servicesCache = new Map<string, any[]>();

const getLowestServicePrice = (services: any[]): number | null => {
  if (!services?.length) return null;
  const prices = services
    .map((s: any) => {
      const raw = s.price ?? s.pricePerHour ?? s.price_per_hour ??
        s.pricePerSession ?? s.price_per_session ??
        s.basePrice ?? s.base_price;
      const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      return isNaN(n) || n <= 0 ? null : n;
    })
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

// ── InspirationItemCard ───────────────────────────────────────────────────────

const INSP_COLORS: Record<string, [string, string]> = {
  arte:   ['#7c3aed', '#2563eb'],
  foto:   ['#059669', '#0ea5e9'],
  musica: ['#db2777', '#f59e0b'],
  bodas:  ['#ec4899', '#f43f5e'],
  teatro: ['#dc2626', '#ea580c'],
};

const InspirationItemCard: React.FC<{
  post:             InspirationPost;
  projectId:        string;
  isDark:           boolean;
  onRemove:         () => void;
  onPriceResolved?: (id: string, price: number) => void;
}> = ({ post, projectId, isDark, onRemove, onPriceResolved }) => {
  const { setCustomPrice, getCustomPrice } = useListsStore();
  const [editing, setEditing]   = useState(false);
  const [inputVal, setInputVal] = useState('');

  const customPrice = getCustomPrice(projectId, post.id);
  const price = typeof customPrice === 'number' && customPrice > 0 ? customPrice : 0;

  useEffect(() => { onPriceResolved?.(post.id, price); }, [post.id, price]);

  const startEdit = () => {
    setInputVal(price > 0 ? String(price) : '');
    setEditing(true);
  };

  const confirmEdit = () => {
    const parsed = parseInt(inputVal.replace(/\D/g, '')) || 0;
    setCustomPrice(projectId, post.id, parsed);
    setEditing(false);
  };

  const confirmRemove = () =>
    Alert.alert('Quitar inspiración', `¿Quitar "${post.title || 'esta inspiración'}" del proyecto?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: onRemove },
    ]);

  const grad = INSP_COLORS[post.category] ?? ['#7c3aed', '#2563eb'];

  return (
    <View style={[styles.itemCard, isDark && styles.itemCardDark]}>
      <View style={styles.itemImg}>
        {post.image ? (
          <Image source={{ uri: post.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, isDark && styles.itemNameDark]} numberOfLines={1}>
          {post.title || 'Inspiración'}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: '#34d39920' }]}>
          <Text style={[styles.typeText, { color: '#34d399' }]}>Inspiración</Text>
        </View>

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.priceInput, isDark && styles.priceInputDark]}
              value={inputVal}
              onChangeText={setInputVal}
              keyboardType="numeric"
              placeholder="$ precio"
              placeholderTextColor={isDark ? 'rgba(167,139,250,0.35)' : '#9ca3af'}
              autoFocus
              onSubmitEditing={confirmEdit}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={confirmEdit} style={styles.editSaveBtn}>
              <Text style={styles.editSaveTxt}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Ionicons name="close" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        ) : price > 0 ? (
          <View style={styles.priceRow}>
            <Text style={[styles.priceVal, isDark && styles.priceValDark]}>
              {formatCOP(price)}
            </Text>
            <TouchableOpacity onPress={startEdit} style={styles.editIconBtn} hitSlop={8}>
              <Ionicons name="pencil" size={11} color={isDark ? '#a78bfa' : '#7c3aed'} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={startEdit} style={[styles.addPriceBtn, isDark && styles.addPriceBtnDark]}>
            <Ionicons name="add" size={12} color={isDark ? '#a78bfa' : '#7c3aed'} />
            <Text style={[styles.addPriceTxt, isDark && styles.addPriceTxtDark]}>
              Agregar precio
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={confirmRemove} style={styles.removeBtn} hitSlop={8}>
        <Ionicons name="close" size={14} color="#f87171" />
      </TouchableOpacity>
    </View>
  );
};

// ── ItemCard ──────────────────────────────────────────────────────────────────

const ItemCard: React.FC<{
  item:             ExploreCard;
  projectId:        string;
  isDark:           boolean;
  onRemove:         () => void;
  onPriceResolved?: (id: string, price: number) => void;
}> = ({ item, projectId, isDark, onRemove, onPriceResolved }) => {
  const { setCustomPrice, getCustomPrice } = useListsStore();
  const [editing, setEditing]       = useState(false);
  const [inputVal, setInputVal]     = useState('');
  const [liveServices, setLiveServices] = useState<any[]>(
    () => _servicesCache.get(item.id) ?? []
  );

  // Para artistas: cargar servicios reales de la API (igual que ArtistCard)
  useEffect(() => {
    if (item.type !== 'artist') return;
    if (_servicesCache.has(item.id)) return;
    servicesService.getUserServices(item.id)
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          _servicesCache.set(item.id, res);
          setLiveServices(res);
        }
      })
      .catch(() => {});
  }, [item.id, item.type]);

  // Precio: custom > servicios API > servicesData embebidos > item.price
  const customPrice = getCustomPrice(projectId, item.id);
  const livePrice   = item.type === 'artist'
    ? (getLowestServicePrice(liveServices) ?? getLowestServicePrice((item as any).servicesData) ?? (item.price > 0 ? item.price : null))
    : (item.price > 0 ? item.price : null);
  // Si hay precio real de datos, se muestra solo (no editable)
  // Si no hay precio real, el usuario puede agregar/editar uno manual
  const hasLivePrice = livePrice !== null && livePrice > 0;
  const price = hasLivePrice ? livePrice : (typeof customPrice === 'number' && customPrice > 0 ? customPrice : 0);

  // Reportar precio resuelto al padre para que calcule el total correctamente
  useEffect(() => { onPriceResolved?.(item.id, price); }, [item.id, price]);

  const colors = TYPE_COLORS[item.type] ?? ['#7c3aed', '#2563eb'];

  const startEdit = () => {
    setInputVal(price > 0 ? String(price) : '');
    setEditing(true);
  };

  const confirmEdit = () => {
    const parsed = parseInt(inputVal.replace(/\D/g, '')) || 0;
    setCustomPrice(projectId, item.id, parsed);
    setEditing(false);
  };

  const confirmRemove = () =>
    Alert.alert('Quitar del proyecto', `¿Quitar "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quitar', style: 'destructive', onPress: onRemove },
    ]);

  return (
    <View style={[styles.itemCard, isDark && styles.itemCardDark]}>

      {/* Imagen */}
      <View style={styles.itemImg}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>

      {/* Info */}
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, isDark && styles.itemNameDark]} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Badge tipo */}
        <View style={[
          styles.typeBadge,
          { backgroundColor: (TYPE_DOT[item.type] ?? '#a78bfa') + '20' },
        ]}>
          <Text style={[styles.typeText, { color: TYPE_DOT[item.type] ?? '#a78bfa' }]}>
            {TYPE_LABELS[item.type] ?? item.type}
          </Text>
        </View>

        {/* Precio */}
        {hasLivePrice ? (
          // Precio real del ítem — solo lectura
          <Text style={[styles.priceVal, isDark && styles.priceValDark]}>
            {formatCOP(price)}
          </Text>
        ) : editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.priceInput, isDark && styles.priceInputDark]}
              value={inputVal}
              onChangeText={setInputVal}
              keyboardType="numeric"
              placeholder="$ precio"
              placeholderTextColor={isDark ? 'rgba(167,139,250,0.35)' : '#9ca3af'}
              autoFocus
              onSubmitEditing={confirmEdit}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={confirmEdit} style={styles.editSaveBtn}>
              <Text style={styles.editSaveTxt}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Ionicons name="close" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        ) : price > 0 ? (
          <View style={styles.priceRow}>
            <Text style={[styles.priceVal, isDark && styles.priceValDark]}>
              {formatCOP(price)}
            </Text>
            <TouchableOpacity onPress={startEdit} style={styles.editIconBtn} hitSlop={8}>
              <Ionicons name="pencil" size={11} color={isDark ? '#a78bfa' : '#7c3aed'} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={startEdit} style={[styles.addPriceBtn, isDark && styles.addPriceBtnDark]}>
            <Ionicons name="add" size={12} color={isDark ? '#a78bfa' : '#7c3aed'} />
            <Text style={[styles.addPriceTxt, isDark && styles.addPriceTxtDark]}>
              Agregar precio
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quitar */}
      <TouchableOpacity
        onPress={confirmRemove}
        style={styles.removeBtn}
        hitSlop={8}
      >
        <Ionicons name="close" size={14} color="#f87171" />
      </TouchableOpacity>
    </View>
  );
};

// ── ProjectDetailScreen ───────────────────────────────────────────────────────

type Props = {
  project: Project;
  visible: boolean;
  onClose: () => void;
};

export const ProjectDetailScreen: React.FC<Props> = ({ project, visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const { removeFromProject, removeInspirationFromProject } = useListsStore();
  const { removeFromProjectId, posts: allPosts } = useInspirationStore();
  const [activeFilter, setActiveFilter] = useState('all');
  // Mapa de precios resueltos: itemId → precio efectivo (API + custom)
  const [resolvedPrices, setResolvedPrices] = useState<Record<string, number>>({});

  const handlePriceResolved = useCallback((id: string, price: number) => {
    setResolvedPrices(prev => prev[id] === price ? prev : { ...prev, [id]: price });
  }, []);

  // Inspiraciones guardadas en este proyecto
  const inspirationPosts = allPosts.filter(p => project.inspirations?.includes(p.id));

  const totalItems = project.cards.length + inspirationPosts.length;
  // Total y con-precio calculados desde los precios resueltos por cada card
  const total     = Object.values(resolvedPrices).reduce((sum, p) => sum + (p > 0 ? p : 0), 0);
  const withPrice = Object.values(resolvedPrices).filter(p => p > 0).length;
  const pct       = Math.min(Math.round((withPrice / Math.max(totalItems, 1)) * 100), 100);

  // Lista unificada según el filtro activo
  const filteredItems: ListItem[] = (() => {
    if (activeFilter === 'own') {
      return inspirationPosts.map(p => ({ kind: 'inspiration', data: p }));
    }
    const cards: ListItem[] = (activeFilter === 'all'
      ? project.cards
      : project.cards.filter(c => c.type === activeFilter)
    ).map(c => ({ kind: 'card', data: c }));

    const insps: ListItem[] = activeFilter === 'all'
      ? inspirationPosts.map(p => ({ kind: 'inspiration', data: p }))
      : [];

    return [...cards, ...insps];
  })();

  const handleRemovePrice = useCallback((id: string) => {
    setResolvedPrices(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleRemoveInspiration = useCallback((postId: string) => {
    removeInspirationFromProject(project.id, postId);
    removeFromProjectId(postId, project.id);
    handleRemovePrice(postId);
  }, [project.id, handleRemovePrice]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.kind === 'inspiration') {
      return (
        <InspirationItemCard
          post={item.data}
          projectId={project.id}
          isDark={isDark}
          onRemove={() => handleRemoveInspiration(item.data.id)}
          onPriceResolved={handlePriceResolved}
        />
      );
    }
    return (
      <ItemCard
        item={item.data}
        projectId={project.id}
        isDark={isDark}
        onRemove={() => { removeFromProject(project.id, item.data.id); handleRemovePrice(item.data.id); }}
        onPriceResolved={handlePriceResolved}
      />
    );
  }, [project.id, isDark, handlePriceResolved]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.root, isDark && styles.rootDark]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[
          styles.header,
          isDark && styles.headerDark,
          { paddingTop: insets.top + 8 },
        ]}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.backBtn, isDark && styles.backBtnDark]}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={isDark ? '#f5f3ff' : '#1e1b4b'} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name={project.icon as any} size={20} color="#7c3aed" />
            <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]} numberOfLines={1}>
              {project.name}
            </Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={i => `${i.kind}_${i.data.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"

          ListHeaderComponent={
            <>
              {/* ── Banner resumen inversión ── */}
              <View style={[styles.summary, isDark && styles.summaryDark]}>
                <View style={styles.summaryTop}>
                  <View>
                    <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                      Inversión estimada
                    </Text>
                    <Text style={[styles.summaryTotal, isDark && styles.summaryTotalDark]}>
                      {formatCOP(total)}
                    </Text>
                    <Text style={[styles.summaryItems, isDark && styles.summaryItemsDark]}>
                      {withPrice} de {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'} con precio
                    </Text>
                  </View>
                  <View style={[styles.summaryBadge, isDark && styles.summaryBadgeDark]}>
                    <Text style={[styles.summaryBadgeText, isDark && styles.summaryBadgeTextDark]}>
                      {withPrice < totalItems
                        ? `${totalItems - withPrice} sin precio`
                        : '¡Completo!'}
                    </Text>
                  </View>
                </View>

                {/* Barra de progreso */}
                <View style={[styles.progressBar, isDark && styles.progressBarDark]}>
                  <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={[styles.progressLbl, isDark && styles.progressLblDark]}>
                    {pct}% con precio asignado
                  </Text>
                  <Text style={[styles.progressLbl, isDark && styles.progressLblDark]}>
                    {totalItems} ítems
                  </Text>
                </View>
              </View>

              {/* ── Filtros compactos ── */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
                style={styles.filtersRow}
              >
                {FILTERS.map(f => (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => setActiveFilter(f.key)}
                    style={[
                      styles.filterChip,
                      isDark && styles.filterChipDark,
                      activeFilter === f.key && styles.filterChipActive,
                    ]}
                  >
                    {f.key !== 'all' && (
                      <View style={[
                        styles.filterDot,
                        { backgroundColor: TYPE_DOT[f.key] ?? '#a78bfa' },
                      ]} />
                    )}
                    <Text style={[
                      styles.filterText,
                      isDark && styles.filterTextDark,
                      activeFilter === f.key && styles.filterTextActive,
                    ]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Contador */}
              <Text style={[styles.counter, isDark && styles.counterDark]}>
                {filteredItems.length} {filteredItems.length === 1 ? 'ítem' : 'ítems'}
                {activeFilter !== 'all' ? ` · ${TYPE_LABELS[activeFilter] ?? ''}` : ''}
              </Text>
            </>
          }

          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📂</Text>
              <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                {activeFilter === 'all' ? 'Proyecto vacío' : `Sin ${TYPE_LABELS[activeFilter]?.toLowerCase() ?? 'ítems'}`}
              </Text>
              <Text style={[styles.emptySub, isDark && styles.emptySubDark]}>
                {activeFilter === 'all'
                  ? 'Agrega ítems desde tus favoritos.'
                  : 'Prueba con otro filtro.'}
              </Text>
            </View>
          }

          renderItem={renderItem}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#faf9ff' },
  rootDark: { backgroundColor: '#0a0618' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.12)',
    backgroundColor: '#faf9ff',
  },
  headerDark: { backgroundColor: '#0d0820', borderBottomColor: 'rgba(139,92,246,0.15)' },
  backBtn: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  backBtnDark: { backgroundColor: 'rgba(124,58,237,0.12)' },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  headerTitle: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', flexShrink: 1,
  },
  headerTitleDark: { color: '#f5f3ff' },

  listContent: { paddingHorizontal: 16, paddingTop: 16 },

  // Resumen
  summary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
    marginBottom: 16,
    shadowColor: '#5b21b6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  summaryDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.22)',
    shadowColor: '#000', shadowOpacity: 0.3,
  },
  summaryTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.5)', textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: 3,
  },
  summaryLabelDark: { color: 'rgba(167,139,250,0.55)' },
  summaryTotal: {
    fontSize: 26, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', letterSpacing: -0.5,
  },
  summaryTotalDark: { color: '#f5f3ff' },
  summaryItems: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginTop: 2,
  },
  summaryItemsDark: { color: 'rgba(167,139,250,0.5)' },
  summaryBadge: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  summaryBadgeDark: {
    backgroundColor: 'rgba(124,58,237,0.14)',
    borderColor: 'rgba(139,92,246,0.3)',
  },
  summaryBadgeText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
  summaryBadgeTextDark: { color: '#a78bfa' },
  progressBar: {
    height: 4, backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 2, overflow: 'hidden', marginBottom: 6,
  },
  progressBarDark: { backgroundColor: 'rgba(139,92,246,0.15)' },
  progressFill: {
    height: '100%', borderRadius: 2,
    backgroundColor: '#7c3aed',
  },
  progressLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  progressLbl: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
  },
  progressLblDark: { color: 'rgba(167,139,250,0.5)' },

  // Filtros
  filtersRow: { marginBottom: 12 },
  filtersContent: { gap: 6, paddingVertical: 2 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  filterChipDark: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(124,58,237,0.18)',
    borderColor: 'rgba(124,58,237,0.4)',
  },
  filterDot: { width: 6, height: 6, borderRadius: 3 },
  filterText: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#6b7280',
  },
  filterTextDark: { color: '#6b7280' },
  filterTextActive: { color: '#a78bfa' },

  // Contador
  counter: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.5)', marginBottom: 10,
  },
  counterDark: { color: 'rgba(167,139,250,0.5)' },

  // Item card
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14, padding: 10,
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)',
    marginBottom: 8,
    shadowColor: '#5b21b6', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  itemCardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.18)',
    shadowColor: '#000', shadowOpacity: 0.25,
  },
  itemImg: {
    width: 52, height: 52, borderRadius: 10,
    backgroundColor: '#e5e7eb', overflow: 'hidden', flexShrink: 0,
  },
  itemInfo: { flex: 1, gap: 3, minWidth: 0 },
  itemName: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  itemNameDark: { color: '#f5f3ff' },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20,
  },
  typeText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold' },

  // Precio
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceVal: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b',
  },
  priceValDark: { color: '#f5f3ff' },
  editIconBtn: {
    width: 22, height: 22, borderRadius: 7,
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Agregar precio
  addPriceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(124,58,237,0.28)',
    alignSelf: 'flex-start',
  },
  addPriceBtnDark: {
    backgroundColor: 'rgba(124,58,237,0.10)',
    borderColor: 'rgba(139,92,246,0.35)',
  },
  addPriceTxt: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
  addPriceTxtDark: { color: '#a78bfa' },

  // Input edición precio
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceInput: {
    flex: 1, borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.3)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1e1b4b', backgroundColor: 'rgba(245,243,255,0.5)',
    maxWidth: 130,
  },
  priceInputDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(167,139,250,0.3)', color: '#f5f3ff',
  },
  editSaveBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    backgroundColor: '#7c3aed',
  },
  editSaveTxt: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },

  // Remove
  removeBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  // Empty
  empty: {
    alignItems: 'center', paddingVertical: 40, gap: 8,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 4 },
  emptyTitle: {
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  emptyTitleDark: { color: '#f5f3ff' },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', textAlign: 'center',
  },
  emptySubDark: { color: 'rgba(167,139,250,0.5)' },
});