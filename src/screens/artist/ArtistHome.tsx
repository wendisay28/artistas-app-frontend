// src/screens/artist/ArtistHome.tsx
// Home del artista autenticado — usa ArtistDashboard + Portal del Autor

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { ArtistDashboard } from '../../components/home/ArtistDashboard';
import { PortalAutorScreen } from './PortalAutorScreen';

export const ArtistHome = () => {
  const { user } = useAuthStore();
  const [portalVisible, setPortalVisible] = useState(false);

  const initials = (user?.displayName || 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.displayName?.split(' ')[0] || 'Artista'} 👋</Text>
          <Text style={styles.subGreeting}>Tu espacio de trabajo en BuscArt</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => setPortalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard content */}
      <ArtistDashboard
        onCompleteProfile={() => setPortalVisible(true)}
      />

      {/* Portal del Autor modal */}
      <Modal
        visible={portalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPortalVisible(false)}
      >
        <PortalAutorScreen onClose={() => setPortalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  greeting: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  subGreeting: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: '#7e22ce', marginTop: 2 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d8b4fe',
  },
  avatarText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#9333ea' },
});
