import React, { useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  isDark: boolean;
  onClose: () => void;
  onSaved?: (collectionId: string) => void;
};

type Collection = { id: string; name: string; count: number };

export default function SaveToCollectionModal({ visible, isDark, onClose, onSaved }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const collections = useMemo<Collection[]>(
    () => [
      { id: 'col-1', name: 'Inspiración', count: 24 },
      { id: 'col-2', name: 'Referencias', count: 12 },
      { id: 'col-3', name: 'Eventos', count: 7 },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter(c => c.name.toLowerCase().includes(q));
  }, [collections, query]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[st.root, isDark && st.rootDark]}>
        <View style={[st.header, { paddingTop: insets.top + 8 }]}> 
          <Pressable onPress={onClose} style={({ pressed }) => [st.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chevron-down" size={22} color={isDark ? '#fff' : '#111'} />
          </Pressable>
          <Text style={[st.title, isDark && st.titleDark]}>Guardar</Text>
          <View style={st.headerSpacer} />
        </View>

        <View style={st.searchWrap}>
          <Ionicons name="search" size={16} color={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)'} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar colección"
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
            style={[st.searchInput, isDark && st.searchInputDark]}
          />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          {filtered.map(col => (
            <Pressable
              key={col.id}
              onPress={() => {
                onSaved?.(col.id);
                onClose();
              }}
              style={({ pressed }) => [st.item, isDark && st.itemDark, pressed && { opacity: 0.75 }]}
            >
              <View style={st.itemLeft}>
                <View style={[st.dot, isDark && st.dotDark]} />
                <View>
                  <Text style={[st.itemName, isDark && st.itemNameDark]}>{col.name}</Text>
                  <Text style={[st.itemMeta, isDark && st.itemMetaDark]}>{col.count} guardados</Text>
                </View>
              </View>
              <Ionicons name="bookmark" size={18} color={isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  rootDark: { backgroundColor: '#0a0618' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111',
  },
  titleDark: { color: '#fff' },
  headerSpacer: { width: 36 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    marginTop: 10,
    marginHorizontal: 14,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#111',
  },
  searchInputDark: { color: '#fff' },
  item: {
    marginTop: 10,
    marginHorizontal: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  itemDark: { backgroundColor: 'rgba(255,255,255,0.06)' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7c3aed' },
  dotDark: { backgroundColor: '#a78bfa' },
  itemName: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#111' },
  itemNameDark: { color: '#fff' },
  itemMeta: { marginTop: 1, fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(0,0,0,0.45)' },
  itemMetaDark: { color: 'rgba(255,255,255,0.45)' },
});
