// src/screens/contracts/ContractsListScreen.tsx
// Pantalla principal de contratos para clientes y artistas

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { contractsService } from '../../services/api/contracts';
import type { Contract, ContractFilters, ContractStatus } from '../../types/contracts';
import ContractCard from '../../components/contracts/ContractCard';
import ContractStatusBadge from '../../components/contracts/ContractStatusBadge';

type ContractType = 'client' | 'artist';

const CONTRACT_TYPES = [
  { key: 'client' as ContractType, label: 'Como cliente', icon: 'person-outline' },
  { key: 'artist' as ContractType, label: 'Como artista', icon: 'camera-outline' }
];

const STATUS_FILTERS: { status: ContractStatus; label: string }[] = [
  { status: 'pending_payment', label: 'Esperando pago' },
  { status: 'escrow_hold', label: 'Pagado' },
  { status: 'in_progress', label: 'En progreso' },
  { status: 'disputed', label: 'En disputa' },
  { status: 'completed', label: 'Completado' },
  { status: 'cancelled', label: 'Cancelado' }
];

export default function ContractsListScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contractType, setContractType] = useState<ContractType>('client');
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const loadContracts = useCallback(async (type: ContractType, status?: ContractStatus) => {
    try {
      setLoading(true);
      const filters: ContractFilters = {
        type,
        ...(status && status !== 'all' && { status })
      };
      
      const data = await contractsService.getUserContracts(type);
      setContracts(data);
    } catch (error) {
      console.error('Error loading contracts:', error);
      Alert.alert('Error', 'No se pudieron cargar los contratos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadContracts(contractType, selectedStatus === 'all' ? undefined : selectedStatus);
  }, [contractType, selectedStatus, loadContracts]);

  useFocusEffect(
    useCallback(() => {
      loadContracts(contractType, selectedStatus === 'all' ? undefined : selectedStatus);
    }, [contractType, selectedStatus, loadContracts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadContracts(contractType, selectedStatus === 'all' ? undefined : selectedStatus);
  };

  const handleContractPress = (contract: Contract) => {
    navigation.navigate('ContractDetails', { contractId: contract.id });
  };

  const renderContract = ({ item }: { item: Contract }) => (
    <ContractCard
      contract={item}
      onPress={handleContractPress}
      showActions={true}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Sin contratos</Text>
        <Text style={styles.emptySubtitle}>
          {contractType === 'client' 
            ? 'Aún no has contratado ningún servicio'
            : 'Aún no tienes contratos activos'
          }
        </Text>
      </View>
    );
  };

  const filteredContracts = contracts.filter(contract => 
    selectedStatus === 'all' || contract.status === selectedStatus
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Contratos</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Type Selector */}
      <View style={styles.typeSelector}>
        {CONTRACT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.typeTab,
              contractType === type.key && styles.typeTabActive
            ]}
            onPress={() => setContractType(type.key)}
          >
            <Ionicons
              name={type.icon}
              size={16}
              color={contractType === type.key ? '#7c3aed' : '#6b7280'}
            />
            <Text style={[
              styles.typeTabText,
              contractType === type.key && styles.typeTabTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Status Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterChip, selectedStatus === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[
              styles.filterChipText,
              selectedStatus === 'all' && styles.filterChipTextActive
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.status}
              style={[
                styles.filterChip,
                selectedStatus === filter.status && styles.filterChipActive
              ]}
              onPress={() => setSelectedStatus(filter.status)}
            >
              <ContractStatusBadge status={filter.status} size="small" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Contracts List */}
      <FlatList
        data={filteredContracts}
        renderItem={renderContract}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  typeTabActive: {
    borderBottomColor: '#7c3aed',
  },
  typeTabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6b7280',
  },
  typeTabTextActive: {
    color: '#7c3aed',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#7c3aed',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
