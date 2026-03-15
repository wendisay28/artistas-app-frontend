// ─────────────────────────────────────────────────────────────────────────────
// inspirationStore.ts — Re-exporta desde el store canónico
//
// El store canónico vive en:
//   src/screens/favorites/components/inspiration/Inspirationstore.ts
//
// Este archivo existe para que las importaciones legacy del tipo
//   import { useInspirationStore } from '../../../store/inspirationStore'
// sigan funcionando sin cambios.
// ─────────────────────────────────────────────────────────────────────────────

export {
  useInspirationStore,
  type InspirationPost,
  type InspirationCategory,
  type InspirationSource,
} from '../screens/favorites/components/inspiration/Inspirationstore';
