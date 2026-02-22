// ─────────────────────────────────────────────────────────────────────────────
// CategorySelector.tsx — Selector de categorías para artistas
// Permite seleccionar categoría → disciplina → rol en cascada
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme';
import { ARTIST_CATEGORIES, getCategoryById, getDisciplineById, getLocalizedCategoryName, getLocalizedDisciplineName, getLocalizedRoleName, getDisciplinesByCategory, getRolesByDiscipline } from '../../../../constants/artistCategories';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ArtistCategorySelection = {
  categoryId: string;
  disciplineId: string;
  roleId: string;
};

type Props = {
  selection?: ArtistCategorySelection;
  onChange: (selection: ArtistCategorySelection) => void;
  disabled?: boolean;
};

// ── Componentes auxiliares ────────────────────────────────────────────────────

const ChevronDown: React.FC<{ rotated: boolean }> = ({ rotated }) => {
  const rotateAnim = new Animated.Value(rotated ? 1 : 0);
  
  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: rotated ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [rotated]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            }),
          },
        ],
      }}
    >
      <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
    </Animated.View>
  );
};

// ── Componente principal ───────────────────────────────────────────────────────

export const ArtistCategorySelector: React.FC<Props> = ({
  selection,
  onChange,
  disabled = false,
}) => {
  const [expandedSection, setExpandedSection] = useState<'category' | 'discipline' | 'role' | null>(null);

  const selectedCategory = ARTIST_CATEGORIES.find(cat => cat.id === selection?.categoryId);
  const selectedDiscipline = selectedCategory?.disciplines.find(disc => disc.id === selection?.disciplineId);
  const selectedRole = selectedDiscipline?.roles.find(role => role.id === selection?.roleId);

  const disciplines = selection?.categoryId ? getDisciplinesByCategory(selection.categoryId) : [];
  const roles = selection?.disciplineId ? getRolesByDiscipline(selection.categoryId, selection.disciplineId) : [];

  const handleCategorySelect = (categoryId: string) => {
    onChange({
      categoryId,
      disciplineId: '',
      roleId: '',
    });
    setExpandedSection('discipline');
  };

  const handleDisciplineSelect = (disciplineId: string) => {
    if (selection?.categoryId) {
      onChange({
        categoryId: selection.categoryId,
        disciplineId,
        roleId: '',
      });
      setExpandedSection('role');
    }
  };

  const handleRoleSelect = (roleId: string) => {
    if (selection?.categoryId && selection?.disciplineId) {
      onChange({
        categoryId: selection.categoryId,
        disciplineId: selection.disciplineId,
        roleId,
      });
      setExpandedSection(null);
    }
  };

  const toggleSection = (section: 'category' | 'discipline' | 'role') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoría Artística</Text>
      
      {/* Categoría seleccionada */}
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabled]}
        onPress={() => !disabled && toggleSection('category')}
        disabled={disabled}
      >
        <View style={styles.selectorContent}>
          <Ionicons 
            name="brush-outline" 
            size={18} 
            color={selectedCategory ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[styles.selectorText, !selectedCategory && styles.placeholderText]}>
            {getLocalizedCategoryName(selectedCategory?.id || '') || 'Selecciona una categoría'}
          </Text>
        </View>
        <ChevronDown rotated={expandedSection === 'category'} />
      </TouchableOpacity>

      {/* Lista de categorías */}
      {expandedSection === 'category' && (
        <View style={styles.dropdown}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
            {ARTIST_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                 styles.option,
                  selection?.categoryId === category.id && styles.selectedOption,
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <View style={styles.optionContent}>
                  <Ionicons 
                    name="brush-outline" 
                    size={16} 
                    color={selection?.categoryId === category.id ? Colors.primary : Colors.textSecondary} 
                  />
                  <Text style={[
                    styles.optionText,
                    selection?.categoryId === category.id && styles.selectedOptionText,
                  ]}>
                    {getLocalizedCategoryName(category.id)}
                  </Text>
                </View>
                {selection?.categoryId === category.id && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Disciplina seleccionada */}
      {selectedCategory && (
        <TouchableOpacity
          style={[styles.selector, styles.marginTop, disabled && styles.disabled]}
          onPress={() => !disabled && toggleSection('discipline')}
          disabled={disabled}
        >
          <View style={styles.selectorContent}>
            <Ionicons 
              name="layers-outline" 
              size={18} 
              color={selectedDiscipline ? Colors.primary : Colors.textSecondary} 
            />
            <Text style={[styles.selectorText, !selectedDiscipline && styles.placeholderText]}>
              {getLocalizedDisciplineName(selectedCategory?.id || '', selectedDiscipline?.id || '') || 'Selecciona una disciplina'}
            </Text>
          </View>
          <ChevronDown rotated={expandedSection === 'discipline'} />
        </TouchableOpacity>
      )}

      {/* Lista de disciplinas */}
      {expandedSection === 'discipline' && disciplines.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
            {disciplines.map((discipline) => (
              <TouchableOpacity
                key={discipline.id}
                style={[
                  styles.option,
                  selection?.disciplineId === discipline.id && styles.selectedOption,
                ]}
                onPress={() => handleDisciplineSelect(discipline.id)}
              >
                <View style={styles.optionContent}>
                  <Ionicons 
                    name="layers-outline" 
                    size={16} 
                    color={selection?.disciplineId === discipline.id ? Colors.primary : Colors.textSecondary} 
                  />
                  <Text style={[
                    styles.optionText,
                    selection?.disciplineId === discipline.id && styles.selectedOptionText,
                  ]}>
                    {getLocalizedDisciplineName(selectedCategory?.id || '', discipline.id)}
                  </Text>
                </View>
                {selection?.disciplineId === discipline.id && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Rol seleccionado */}
      {selectedDiscipline && (
        <TouchableOpacity
          style={[styles.selector, styles.marginTop, disabled && styles.disabled]}
          onPress={() => !disabled && toggleSection('role')}
          disabled={disabled}
        >
          <View style={styles.selectorContent}>
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={selectedRole ? Colors.primary : Colors.textSecondary} 
            />
            <Text style={[styles.selectorText, !selectedRole && styles.placeholderText]}>
              {getLocalizedRoleName(selectedCategory?.id || '', selectedDiscipline?.id || '', selectedRole?.id || '') || 'Selecciona un rol'}
            </Text>
          </View>
          <ChevronDown rotated={expandedSection === 'role'} />
        </TouchableOpacity>
      )}

      {/* Lista de roles */}
      {expandedSection === 'role' && roles.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.option,
                  selection?.roleId === role.id && styles.selectedOption,
                ]}
                onPress={() => handleRoleSelect(role.id)}
              >
                <View style={styles.optionContent}>
                  <Ionicons 
                    name="person-outline" 
                    size={16} 
                    color={selection?.roleId === role.id ? Colors.primary : Colors.textSecondary} 
                  />
                  <Text style={[
                    styles.optionText,
                    selection?.roleId === role.id && styles.selectedOptionText,
                  ]}>
                    {getLocalizedRoleName(selectedCategory?.id || '', selectedDiscipline?.id || '', role.id)}
                  </Text>
                </View>
                {selection?.roleId === role.id && (
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Resumen de selección completa */}
      {selectedCategory && selectedDiscipline && selectedRole && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {getLocalizedCategoryName(selectedCategory?.id || '')} → {getLocalizedDisciplineName(selectedCategory?.id || '', selectedDiscipline?.id || '')} → {getLocalizedRoleName(selectedCategory?.id || '', selectedDiscipline?.id || '', selectedRole?.id || '')}
          </Text>
        </View>
      )}
    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  disabled: {
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  marginTop: {
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '08',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  selectedOptionText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
  },
  summary: {
    backgroundColor: Colors.primary + '08',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.primary,
    textAlign: 'center',
  },
});
