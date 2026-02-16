// src/components/modals/TagSelectorModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TagSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectArtist?: (artistId: string) => void;
  onSelectEvent?: (eventId: number) => void;
  selectedArtists?: string[];
  selectedEvents?: number[];
}

type TabType = 'artist' | 'event';

interface SearchItem {
  id: string | number;
  name: string;
  subtitle?: string;
  image?: string;
  type: TabType;
}

export const TagSelectorModal: React.FC<TagSelectorModalProps> = ({
  visible,
  onClose,
  onSelectArtist,
  onSelectEvent,
  selectedArtists = [],
  selectedEvents = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('artist');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search function - replace with your actual API
  const searchItems = async (query: string, type: TabType) => {
    if (query.length < 2) return [];

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const mockData: SearchItem[] = Array.from({ length: 5 }, (_, i) => ({
      id: type === 'artist' ? `artist-${i}` : i,
      name: type === 'artist' ? `Artista ${i + 1}` : `Evento ${i + 1}`,
      subtitle: type === 'artist' ? 'Músico' : '15 de marzo, 2024',
      image: `https://i.pravatar.cc/150?img=${i}`,
      type,
    }));

    setResults(mockData);
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchItems(searchQuery, activeTab);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, activeTab]);

  const handleSelect = (item: SearchItem) => {
    if (item.type === 'artist') {
      if (!selectedArtists.includes(item.id as string)) {
        onSelectArtist?.(item.id as string);
      }
    } else {
      if (!selectedEvents.includes(item.id as number)) {
        onSelectEvent?.(item.id as number);
      }
    }
  };

  const isSelected = (item: SearchItem) => {
    if (item.type === 'artist') {
      return selectedArtists.includes(item.id as string);
    }
    return selectedEvents.includes(item.id as number);
  };

  const renderItem = ({ item }: { item: SearchItem }) => {
    const selected = isSelected(item);

    return (
      <TouchableOpacity
        style={[styles.resultItem, selected && styles.resultItemSelected]}
        onPress={() => handleSelect(item)}
        disabled={selected}
      >
        <View style={styles.resultAvatar}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.resultImage} />
          ) : (
            <View style={styles.resultPlaceholder}>
              {item.type === 'artist' ? (
                <Ionicons name="person-outline" size={24} color="#8b5cf6" />
              ) : (
                <Ionicons name="calendar-outline" size={24} color="#8b5cf6" />
              )}
            </View>
          )}
        </View>

        <View style={styles.resultInfo}>
          <Text style={styles.resultName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.subtitle && (
            <Text style={styles.resultSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
        </View>

        {selected && (
          <View style={styles.selectedIcon}>
            <Ionicons name="sparkles-outline" size={20} color="#8b5cf6" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Etiquetar</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'artist' && styles.tabActive]}
            onPress={() => setActiveTab('artist')}
          >
            <Ionicons name="person-outline" size={16} color={activeTab === 'artist' ? '#8b5cf6' : '#6b7280'} />
            <Text
              style={[styles.tabText, activeTab === 'artist' && styles.tabTextActive]}
            >
              Artistas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'event' && styles.tabActive]}
            onPress={() => setActiveTab('event')}
          >
            <Ionicons name="calendar-outline" size={16} color={activeTab === 'event' ? '#8b5cf6' : '#6b7280'} />
            <Text
              style={[styles.tabText, activeTab === 'event' && styles.tabTextActive]}
            >
              Eventos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Buscar ${activeTab === 'artist' ? 'artistas' : 'eventos'}...`}
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            autoFocus
          />
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          ) : searchQuery.length < 2 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Escribe al menos 2 caracteres para buscar
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No se encontraron {activeTab === 'artist' ? 'artistas' : 'eventos'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    padding: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  resultItemSelected: {
    backgroundColor: '#f5f3ff',
    opacity: 0.6,
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9d5ff',
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  resultPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  resultSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedIcon: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});