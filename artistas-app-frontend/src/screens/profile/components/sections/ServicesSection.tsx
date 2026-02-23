// src/screens/profile/components/sections/ServicesSection.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Spacing } from '../../../../theme';
import { Service as APIService } from '../../../../services/api/services';
import { EditServiceModal, ServiceFormData } from '../modals/EditServiceModal';
import { servicesService } from '../../../../services/api/services';

interface ServicesSectionProps {
  services: APIService[];
  isOwner: boolean;
  onServicesUpdated?: () => void;
}

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Service Card ─────────────────────────────────────────────────────────────

interface ServiceCardDetailProps {
  service: APIService;
  index: number;
  showEdit?: boolean;
  onEdit?: (service: APIService) => void;
}

const ServiceCardDetail: React.FC<ServiceCardDetailProps> = ({ service, index, showEdit, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const name = service.name;
  const price = service.price;
  const icon = 'camera-outline';
  const description = service.description;
  const duration = service.duration;
  const category = service.category;

  const hasExtras = description;

  return (
    <Pressable
      onPress={() => {
        if (hasExtras) {
          if (Platform.OS !== 'web') Haptics.selectionAsync();
          setExpanded(p => !p);
        }
      }}
      style={({ pressed }) => [
        scd.card,
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={scd.accentBar} />
      <View style={scd.inner}>
        {showEdit && (
          <TouchableOpacity style={scd.editButton} onPress={() => {
            if (onEdit) {
              onEdit(service);
            }
          }}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
          </TouchableOpacity>
        )}
        <View style={scd.topRow}>
          <View style={scd.iconWrap}>
            <Ionicons name={icon} size={18} color={Colors.primary} />
          </View>
          <View style={scd.nameBlock}>
            <Text style={scd.name} numberOfLines={1}>{name}</Text>
            {category && (
              <View style={scd.categoryPill}>
                <Text style={scd.categoryText}>{category}</Text>
              </View>
            )}
          </View>
          <View style={scd.priceBlock}>
            {price !== null && price !== undefined ? (
              <Text style={scd.price}>{formatCOP(price)}</Text>
            ) : (
              <View style={scd.consultPill}>
                <Text style={scd.consultText}>Consultar</Text>
              </View>
            )}
          </View>
        </View>

        {duration && (
          <View style={scd.chipsRow}>
            <View style={scd.chip}>
              <Ionicons name="time-outline" size={10} color={Colors.primary} />
              <Text style={scd.chipText}>{duration}</Text>
            </View>
          </View>
        )}

        {expanded && description && (
          <View style={scd.expandedBlock}>
            <Text style={scd.description}>{description}</Text>
          </View>
        )}

        {hasExtras && (
          <View style={scd.expandHint}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={13}
              color={Colors.textSecondary}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const scd = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 8,
  },
  accentBar: { width: 3, backgroundColor: Colors.primary, opacity: 0.6 },
  inner: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  editButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(99,102,241,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(99,102,241,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  nameBlock: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text, lineHeight: 18 },
  categoryPill: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1,
  },
  categoryText: {
    fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.primary,
    textTransform: 'uppercase', letterSpacing: 0.4,
  },
  priceBlock: { alignItems: 'flex-end', gap: 2 },
  price: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary },
  consultPill: {
    backgroundColor: 'rgba(99,102,241,0.08)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  consultText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.primary },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#F4F4F8', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  chipText: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: Colors.textSecondary },
  expandedBlock: { gap: 8, paddingTop: 4, borderTopWidth: 1, borderTopColor: Colors.border },
  description: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.textSecondary, lineHeight: 19,
  },
  expandHint: { alignItems: 'center', marginTop: -2 },
});

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  isOwner,
  onServicesUpdated,
}) => {
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<APIService | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);

  const handleAddService = () => {
    setEditingService(null);
    setServiceModalVisible(true);
  };

  const handleEditService = (service: APIService) => {
    setEditingService(service);
    setServiceModalVisible(true);
  };

  const handleSaveService = async (serviceData: ServiceFormData) => {
    try {
      setIsSavingService(true);
      
      if (editingService) {
        const updateData: Partial<APIService> = {
          name: serviceData.name || '',
          description: serviceData.description || '',
          price: parseFloat(serviceData.price) || 0,
          duration: serviceData.duration || '',
          category: serviceData.category || '',
        };
        await servicesService.updateService(editingService.id!, updateData);
      } else {
        const createData = {
          name: serviceData.name || '',
          description: serviceData.description || '',
          price: parseFloat(serviceData.price) || 0,
          duration: serviceData.duration || '',
          category: serviceData.category || '',
        };
        await servicesService.createService(createData);
      }
      
      setServiceModalVisible(false);
      onServicesUpdated?.();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving service:', error);
      Alert.alert('Error', 'No se pudo guardar el servicio. Inténtalo de nuevo.');
    } finally {
      setIsSavingService(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hint}>Toca una tarjeta para ver detalles</Text>
        {isOwner && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddService}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Nuevo servicio</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.servicesList}>
        {services.map((service: APIService, i: number) => (
          <ServiceCardDetail 
            key={service.id || i} 
            service={service} 
            index={i} 
            showEdit={isOwner} 
            onEdit={handleEditService}
          />
        ))}
      </View>

      <EditServiceModal
        visible={serviceModalVisible}
        onClose={() => setServiceModalVisible(false)}
        onSave={handleSaveService}
        service={editingService}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  servicesList: { flex: 1 },
});
