import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

import type { ButtonProps } from '../../types/ui';

export default function Button({ 
  title, 
  mode = 'contained', 
  onPress, 
  loading = false, 
  disabled = false,
  icon 
}: ButtonProps) {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      style={{
        marginVertical: 8,
        borderRadius: 8,
      }}
    >
      {title}
    </PaperButton>
  );
}
