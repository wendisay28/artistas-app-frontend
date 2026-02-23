# artistas-app-frontend (Expo)

## Requisitos
- Node.js LTS
- Expo Go (Android/iOS)

## Setup
1) Instalar dependencias
npm install

2) Variables de entorno
cp .env.example .env
Edita .env (EXPO_PUBLIC_BACKEND_URL, Firebase, Supabase)

3) Ejecutar
npx expo start

## Backend
La API está en el repo **artistas-app-backend**. Categorías (artistas, eventos, salas, galería) usan **IDs string** (slugs). Contrato: ver `docs/BACKEND-CONTRATO-CATEGORIAS.md`.
