import React from 'react';
import { Card as PaperCard, Text } from 'react-native-paper';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: object;
}

export default function Card({ children, title, style }: CardProps) {
  return (
    <PaperCard
      style={{
        margin: 16,
        elevation: 4,
        borderRadius: 12,
        ...style,
      }}
    >
      {title && (
        <PaperCard.Title
          title={title}
          titleStyle={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        />
      )}
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
}
