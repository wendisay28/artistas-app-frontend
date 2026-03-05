// ─────────────────────────────────────────────────────────────────────
// SobreMiTabs.tsx — Tabs inferiores para la sección sobre mí
// Servicios / Portafolio / Reseñas
// ─────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ReviewCard from '../../../../components/explore/shared/ReviewCard';
import { ServicesSection } from './ServicesSection';
import { PortfolioSection } from './PortfolioSection';

type InnerTab = 'servicios' | 'portafolio' | 'resenas';

interface SobreMiTabsProps {
  services?: any[];
  portfolio?: any[];
  videos?: any[];
  reviews?: any[];
  isOwner?: boolean;
  artistCategoryId?: string;
  artistRoleId?: string;
  onServicesUpdated?: () => void;
  onPortfolioUpdated?: () => void;
}

const INNER_TABS: Array<{
  key: InnerTab;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = [
  { key: 'servicios'  as InnerTab, label: 'Servicios',  icon: 'briefcase-outline' },
  { key: 'portafolio' as InnerTab, label: 'Portafolio', icon: 'grid-outline' },
  { key: 'resenas'    as InnerTab, label: 'Reseñas',    icon: 'star-outline' },
];

export const SobreMiTabs: React.FC<SobreMiTabsProps> = ({
  services = [],
  portfolio = [],
  videos = [],
  reviews = [],
  isOwner = false,
  artistCategoryId,
  artistRoleId,
  onServicesUpdated,
  onPortfolioUpdated,
}) => {
  const [inner, setInner] = useState<InnerTab>('servicios' as InnerTab);


  return (
    <View style={styles.tabsCard}>
      <View style={styles.tabBar}>
        {INNER_TABS.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.tabItem, inner === t.key && styles.tabItemActive]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              setInner(t.key);
            }}
          >
            <Ionicons
              name={t.icon}
              size={15}
              color={inner === t.key ? '#7C3AED' : 'rgba(107,114,128,0.35)'}
            />
            <Text style={[styles.tabLabel, inner === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.tabContent}>
        {inner === 'servicios' && (
          <ServicesSection
            services={services}
            isOwner={isOwner}
            artistCategoryId={artistCategoryId}
            artistRoleId={artistRoleId}
            onServicesUpdated={onServicesUpdated}
          />
        )}
        {inner === 'portafolio' && (
          <PortfolioSection
            portfolio={portfolio}
            videos={videos}
            isOwner={isOwner}
            onPortfolioUpdated={onPortfolioUpdated}
          />
        )}
        {inner === 'resenas' && (
          reviews.length > 0 ? (
            <View style={styles.reviewsContainer}>
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={{
                    id: r.id,
                    authorName: r.reviewerName,
                    rating: r.stars,
                    text: r.text,
                    date: r.date,
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyDashed}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="star-outline" size={28} color="rgba(124,58,237,0.3)" />
              </View>
              <Text style={styles.emptyDashedTitle}>Sin reseñas todavía</Text>
              <Text style={styles.emptyDashedSub}>
                Las opiniones de tus clientes aparecerán aquí. ¡Completa trabajos y pide feedback!
              </Text>

              {/* Separator */}
              <View style={styles.previewSep}>
                <View style={styles.previewSepLine} />
                <Text style={styles.previewSepText}>Así se verá</Text>
                <View style={styles.previewSepLine} />
              </View>

              {/* Preview review card */}
              <View style={[styles.previewCard, { opacity: 0.5 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(124,58,237,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(124,58,237,0.45)' }}>MG</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(30,27,75,0.14)', width: '55%', marginBottom: 5 }} />
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <Ionicons key={i} name="star" size={10} color="rgba(245,158,11,0.4)" />
                      ))}
                    </View>
                  </View>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(124,58,237,0.08)', width: 44 }} />
                </View>
                <View style={{ gap: 5 }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.1)', width: '100%' }} />
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.1)', width: '82%' }} />
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(30,27,75,0.07)', width: '60%' }} />
                </View>
              </View>
            </View>
          )
        )}
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107,114,128,0.12)',
  },
  tabItem: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 5, 
    paddingVertical: 13, 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: '#7C3AED' },
  tabLabel: { 
    fontSize: 12, 
    fontFamily: 'PlusJakartaSans_500Medium', 
    color: 'rgba(107,114,128,0.35)',
  },
  tabLabelActive: { 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: '#7C3AED',
  },
  tabContent: { 
    padding: 16 
  },
  emptyTab: { 
    paddingVertical: 28, 
    alignItems: 'center', 
    gap: 8 
  },
  emptyTabText: {
    fontSize: 13, 
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(107,114,128,0.35)',
  },
  errorText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#dc2626',
    marginTop: 4,
    textAlign: 'center',
  },
  reviewsContainer: { gap: 8 },

  // Empty state morado punteado (igual que portafolio)
  emptyDashed: {
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.18)',
    borderRadius: 16, borderStyle: 'dashed',
    backgroundColor: 'rgba(245,243,255,0.4)',
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16, gap: 8,
  },
  emptyIconWrap: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.07)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  emptyDashedTitle: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b',
  },
  emptyDashedSub: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.4)', textAlign: 'center', lineHeight: 18,
  },
  previewSep: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    width: '100%', marginTop: 4,
  },
  previewSepLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.1)' },
  previewSepText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.3)',
  },
  previewCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)',
  },
});
