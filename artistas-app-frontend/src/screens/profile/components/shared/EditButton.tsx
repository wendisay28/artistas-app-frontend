import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../../../theme';

type EditButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  size?: 'sm' | 'md';
};

export const EditButton: React.FC<EditButtonProps> = ({ 
  onPress, 
  style, 
  size = 'sm' 
}) => {
  const buttonSize = size === 'sm' ? 28 : 32;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <TouchableOpacity
      style={[styles.button, { width: buttonSize, height: buttonSize }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="pencil-outline" 
        size={iconSize} 
        color={Colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
