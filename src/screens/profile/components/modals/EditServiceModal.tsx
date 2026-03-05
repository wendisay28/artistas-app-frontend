import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Keyboard, StatusBar, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../../../../hooks/useProfileImageUpload';

import { getSuggestedTagsForDiscipline } from '../../../../constants/artistCategories';
import {
  getUnitSuggestions, getGenericUnits,
  getDefaultDuration, getDefaultCategory,
} from '../../../../utils/serviceHelpers';
import { ServiceStep1 } from './ServiceStep1';
import { ServiceStep2 } from './ServiceStep2';
import { ServiceStep3 } from './ServiceStep3';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceFormData = {
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  category: string;
  unit: string;
  deliveryTag: string;
  icon: string;
  packageType: 'simple' | 'pack' | 'weekly' | 'monthly';
  includedCount: string;
  deliveryDays: string;
  weeklyFrequency: string;
  deliveryNotApplies: boolean;
  tags: string[];
  imageUrl?: string;
};

type Props = {
  visible: boolean;
  service?: Partial<ServiceFormData> | null;
  artistCategoryId?: string;
  artistRoleId?: string;
  coverImageUrl?: string;
  loading?: boolean;
  onSave: (data: ServiceFormData) => void;
  onClose: () => void;
};

type Step = 'image' | 'info' | 'delivery';

// ── Orchestrator ──────────────────────────────────────────────────────────────

export const EditServiceModal: React.FC<Props> = ({
  visible, service, artistCategoryId, artistRoleId,
  coverImageUrl, loading = false, onSave, onClose,
}) => {
  const isEditing = !!service;

  // Navigation
  const [step, setStep] = useState<Step>('image');

  // Image
  const [localImageUri, setLocalImageUri] = useState('');

  // Step 2 — basic info
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(getDefaultDuration());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 3 — delivery
  const [unit, setUnit] = useState('');
  const [icon, setIcon] = useState('star-outline');
  const [packageType, setPackageType] = useState<'simple' | 'pack' | 'weekly' | 'monthly'>('simple');
  const [includedCount, setIncludedCount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [deliveryNotApplies, setDeliveryNotApplies] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Computed
  const disciplineId = artistRoleId === 'fotografo' ? 'fotografia' : null;
  const artistRoleName = artistRoleId === 'fotografo' ? 'Fotógrafo' : '';

  const finalUnitOptions = useMemo(
    () => (disciplineId ? getUnitSuggestions(disciplineId) : getGenericUnits()),
    [disciplineId]
  );

  const suggestedTags = useMemo(
    () => (artistCategoryId && disciplineId ? getSuggestedTagsForDiscipline(artistCategoryId, disciplineId) : []),
    [artistCategoryId, disciplineId]
  );

  // Reset when modal opens
  useEffect(() => {
    if (!visible) return;

    if (service) {
      setStep('info');
      setLocalImageUri((service as any).images?.[0] || (service as any).imageUrl || '');
      setName(service.name || '');
      setDesc(service.description || '');
      setPrice(service.price?.toString() || '');
      setDuration(service.duration || getDefaultDuration());
      setUnit((service as any).unit || (finalUnitOptions[0]?.id ?? ''));
      setIcon(service.icon || 'star-outline');
      const pt = service.packageType as string;
      setPackageType(pt === 'single' ? 'simple' : (pt as any) || 'simple');
      setIncludedCount(service.includedCount?.toString() || '');
      setDeliveryDays(service.deliveryDays?.toString() || '');
      setDeliveryNotApplies(false);
      setSelectedTags([]);
    } else {
      setStep('image');
      setLocalImageUri('');
      setName(''); setDesc(''); setPrice('');
      setDuration(getDefaultDuration());
      setPackageType('simple');
      setIncludedCount(''); setDeliveryDays('');
      setDeliveryNotApplies(false);
      setErrors({});
      if (finalUnitOptions.length > 0) {
        setUnit(finalUnitOptions[0].id);
        setIcon(finalUnitOptions[0].icon);
      }
      setSelectedTags(suggestedTags.length > 0 ? [suggestedTags[0]] : []);
    }
  }, [visible, service, finalUnitOptions, suggestedTags]);

  const pickFromGallery = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const compressed = await compressImage(result.assets[0].uri, 900, 0.8);
      setLocalImageUri(compressed);
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      setErrors({ name: 'El nombre es obligatorio' });
      setStep('info');
      return;
    }
    const resolvedCategory = disciplineId || service?.category || getDefaultCategory();
    onSave({
      name, description, price, currency: 'COP', duration,
      category: resolvedCategory, unit, deliveryTag: 'standard', icon,
      packageType, includedCount, deliveryDays, weeklyFrequency: '',
      deliveryNotApplies, tags: selectedTags,
      imageUrl: localImageUri || undefined,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <StatusBar barStyle="dark-content" />
      <View style={st.root}>

        {step === 'image' && (
          <ServiceStep1
            localImageUri={localImageUri}
            coverImageUrl={coverImageUrl}
            isEditing={isEditing}
            onPickFromGallery={pickFromGallery}
            onSelectCover={() => setLocalImageUri(
              localImageUri === coverImageUrl ? '' : (coverImageUrl || '')
            )}
            onContinue={() => setStep('info')}
            onSkip={() => { setLocalImageUri(''); setStep('info'); }}
            onBack={isEditing ? () => setStep('info') : onClose}
          />
        )}

        {step === 'info' && (
          <ServiceStep2
            localImageUri={localImageUri}
            name={name} setName={setName}
            description={description} setDesc={setDesc}
            price={price} setPrice={setPrice}
            duration={duration} setDuration={setDuration}
            errors={errors}
            isEditing={isEditing}
            loading={loading}
            artistRoleName={artistRoleName}
            unit={unit}
            onChangeImage={() => setStep('image')}
            onBack={isEditing ? onClose : () => setStep('image')}
            onNext={() => { setErrors({}); setStep('delivery'); }}
          />
        )}

        {step === 'delivery' && (
          <ServiceStep3
            packageType={packageType} setPackageType={setPackageType}
            unit={unit} setUnit={setUnit} setIcon={setIcon}
            finalUnitOptions={finalUnitOptions}
            includedCount={includedCount} setIncludedCount={setIncludedCount}
            deliveryDays={deliveryDays} setDeliveryDays={setDeliveryDays}
            deliveryNotApplies={deliveryNotApplies} setDeliveryNotApplies={setDeliveryNotApplies}
            loading={loading}
            onBack={() => setStep('info')}
            onSave={handleSave}
          />
        )}

      </View>
    </Modal>
  );
};

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf9ff' },
});
