// UI Component Types

export interface ButtonProps {
  title: string;
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface CatalogCardProps {
  title: string;
  price: string;
  image: string;
  tag?: string;
  onPress?: () => void;
}
