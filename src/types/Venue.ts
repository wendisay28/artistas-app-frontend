export type Venue = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  capacity?: number;
  pricePerHour?: number;
  isOutdoor?: boolean;
  hasParking?: boolean;
  hasSoundSystem?: boolean;
  hasLighting?: boolean;
  multimedia?: any;
  rating?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
