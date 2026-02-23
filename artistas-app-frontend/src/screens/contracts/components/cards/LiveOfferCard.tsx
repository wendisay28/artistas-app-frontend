// ─────────────────────────────────────────────────────────────────────────────
// LiveOfferCard.tsx — Tarjeta de oferta en tiempo real (basada en Agenda)
// Para notificaciones de ofertas nuevas con countdown y acciones
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../../../theme';

// ── Props ─────────────────────────────────────────────────────────────────────

interface LiveOfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    offerAmount: string;
    currency: string;
    secondsRemaining: number;
    clientName?: string;
    clientAvatar?: string;
  };
  onAccept?: () => void;
  onDecline?: () => void;
  onCounter?: () => void;
  onChat?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const LiveOfferCard: React.FC<LiveOfferCardProps> = ({ 
  offer, 
  onAccept, 
  onDecline, 
  onCounter,
  onChat 
}) => {
  const [secs, setSecs] = useState(offer.secondsRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(s => (s <= 0 ? offer.secondsRemaining : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(secs / 60)).padStart(2, '0');
  const seconds = String(secs % 60).padStart(2, '0');
  const progress = secs / offer.secondsRemaining;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(184,92,58,0.13)', 'rgba(212,168,83,0.07)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.top}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>NUEVA OFERTA</Text>
        </View>
        <Text style={styles.timer}>{minutes}:{seconds}</Text>
      </View>

      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.desc}>{offer.description}</Text>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <LinearGradient
          colors={[Colors.accent2, Colors.accent]}
          style={[styles.barFill, { width: `${progress * 100}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.budgetLabel}>Oferta del cliente</Text>
          <Text style={styles.budgetVal}>{offer.offerAmount} {offer.currency}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.chatBtn} onPress={onChat} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.text2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn} onPress={onDecline} activeOpacity={0.7}>
            <Text style={styles.declineTxt}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.counterBtn} onPress={onCounter} activeOpacity={0.7}>
            <Text style={styles.counterTxt}>Contraoferta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={onAccept} activeOpacity={0.8}>
            <Text style={styles.acceptTxt}>Aceptar ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(184,92,58,0.38)',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  top: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing.sm 
  },
  badge: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: 'rgba(184,92,58,0.85)',
    borderRadius: Radius.sm, 
    paddingHorizontal: 9, 
    paddingVertical: 3,
  },
  badgeDot: { 
    width: 5, 
    height: 5, 
    borderRadius: 99, 
    backgroundColor: Colors.white 
  },
  badgeText: { 
    fontSize: 9.5, 
    fontWeight: '700', 
    color: Colors.white 
  },
  timer: { 
    fontSize: 19, 
    fontWeight: '700', 
    color: '#e07a58', 
    fontFamily: 'PlusJakartaSans_700Bold' 
  },
  title: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: Colors.text, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    marginBottom: 3 
  },
  desc: { 
    fontSize: 11.5, 
    color: '#a8a4b0', 
    lineHeight: 17 
  },
  barBg: { 
    height: 2, 
    backgroundColor: 'rgba(184,92,58,0.15)', 
    borderRadius: 2, 
    marginTop: Spacing.sm, 
    overflow: 'hidden' 
  },
  barFill: { 
    height: '100%', 
    borderRadius: 2 
  },
  footer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: Spacing.md, 
    paddingTop: Spacing.sm,
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  budgetLabel: { 
    fontSize: 11, 
    color: Colors.text2 
  },
  budgetVal: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: Colors.text, 
    fontFamily: 'PlusJakartaSans_700Bold' 
  },
  actions: { 
    flexDirection: 'row', 
    gap: 6 
  },
  chatBtn: {
    width: 35, 
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.sm, 
    borderWidth: 1, 
    borderColor: Colors.border,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  declineBtn: {
    width: 35, 
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.sm, 
    borderWidth: 1, 
    borderColor: Colors.border,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  declineTxt: { 
    fontSize: 14, 
    color: Colors.text2 
  },
  counterBtn: {
    height: 35, 
    paddingHorizontal: 12,
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderRadius: Radius.sm, 
    borderWidth: 1, 
    borderColor: 'rgba(212,168,83,0.3)',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  counterTxt: { 
    fontSize: 11.5, 
    fontWeight: '600', 
    color: Colors.accent 
  },
  acceptBtn: {
    height: 35, 
    paddingHorizontal: 14,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  acceptTxt: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: Colors.bg 
  },
});
