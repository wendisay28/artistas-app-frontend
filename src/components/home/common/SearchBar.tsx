// src/components/common/SearchBar.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  ScrollView,
  Text,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>; // Corregido: StyleProp permite arrays y objetos
  autoFocus?: boolean;
  showSuggestions?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = '¿Qué quieres buscar hoy?',
  suggestions = [],
  onSuggestionPress,
  onClear,
  style,
  autoFocus = false,
  showSuggestions = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false, // Los colores no soportan driver nativo
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
      Animated.spring(focusAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();
    }
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e5e7eb', '#8b5cf6'],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
        ]}
      >
        <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
        
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={styles.input}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Suggestions */}
      {showSuggestions && (isFocused || value.length > 0) && suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
          contentContainerStyle={styles.suggestionsContent}
          keyboardShouldPersistTaps="handled" // Permite tocar sugerencias sin cerrar el teclado
        >
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => {
                onChangeText(suggestion);
                onSuggestionPress?.(suggestion);
              }}
            >
              <Ionicons name="search" size={12} color="#8b5cf6" />
              <View style={styles.suggestionText}>
                {suggestion.split(' ').map((word, i) => {
                  const isMatch = value.length > 0 && 
                    word.toLowerCase().startsWith(value.toLowerCase());
                  
                  return (
                    <Text key={i} style={styles.suggestionWord}>
                      {isMatch ? (
                        <Text>
                          <Text style={styles.highlight}>
                            {word.slice(0, value.length)}
                          </Text>
                          {word.slice(value.length)}
                        </Text>
                      ) : (
                        word
                      )}
                      {i < suggestion.split(' ').length - 1 && ' '}
                    </Text>
                  );
                })}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// Compact version for headers
export const CompactSearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <SearchBar
      {...props}
      showSuggestions={false}
      style={StyleSheet.flatten([styles.compactContainer, props.style])}
    />
  );
};

// Animated search button
interface AnimatedSearchButtonProps {
  onExpand: () => void;
  style?: StyleProp<ViewStyle>;
}

export const AnimatedSearchButton: React.FC<AnimatedSearchButtonProps> = ({
  onExpand,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onExpand();
    });
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={20} color="#6b7280" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  compactContainer: {
    width: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsContent: {
    paddingRight: 16,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    flexDirection: 'row',
  },
  suggestionWord: {
    fontSize: 13,
    color: '#374151',
  },
  highlight: {
    backgroundColor: '#fef3c7',
    color: '#8b5cf6', // Color de tu marca para el texto resaltado
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});