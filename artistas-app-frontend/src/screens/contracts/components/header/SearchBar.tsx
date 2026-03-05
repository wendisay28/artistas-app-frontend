// components/hiring/header/SearchBar.tsx

import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  hasActiveFilters: boolean;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  hasActiveFilters,
  placeholder = 'Buscar ofertas...',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  // Borde animado al enfocar
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchWrapper, { borderColor }]}>
        {/* Icono de búsqueda */}
        <Ionicons
          name="search-outline"
          size={18}
          color={isFocused ? Colors.primary : Colors.textSecondary}
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never" // manejamos manualmente para consistencia Android/iOS
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Botón de limpiar — solo visible si hay texto */}
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="close-circle" size={17} color={Colors.textLight} />
          </Pressable>
        )}
      </Animated.View>

      {/* Botón de filtros */}
      <TouchableOpacity
        style={[
          styles.filterBtn,
          hasActiveFilters && styles.filterBtnActive,
        ]}
        onPress={onFilterPress}
        activeOpacity={0.75}
      >
        <Ionicons
          name={hasActiveFilters ? 'options' : 'options-outline'}
          size={19}
          color={hasActiveFilters ? '#FFFFFF' : Colors.textSecondary}
        />
        {/* Punto indicador de filtros activos */}
        {hasActiveFilters && <View style={styles.filterDot} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: 10,
  },

  // Wrapper con borde animado
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    // Altura fija para consistencia Android/iOS
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
    // Sin paddingVertical — la altura la controla el wrapper
    padding: 0,
    includeFontPadding: false, // Android: evita padding extra del sistema
  },
  clearBtn: {
    marginLeft: 6,
  },

  // Botón de filtros
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt ?? '#F4F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  // Punto rojo sobre el botón si hay filtros (alternativa al cambio de color)
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    // Solo visible cuando filterBtnActive está activo Y quieres doble indicador
    // Puedes eliminar esto si prefieres solo el cambio de color
    display: 'none', // desactivado por defecto, activa si prefieres este estilo
  },
});