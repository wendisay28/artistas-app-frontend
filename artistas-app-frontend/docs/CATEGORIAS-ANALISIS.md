# Análisis: constantes de categorías (artistas, eventos, salas, galería)

## 1. Qué hay en el frontend

### 1.1 Archivos en `src/constants/`

| Archivo | Constante principal | Estructura | Etiquetas (i18n) |
|--------|----------------------|-----------|-------------------|
| **artistCategories.ts** | `ARTIST_CATEGORIES` | `Category[]`: id → disciplines[] → roles[] → specializations[] (solo IDs) | `STRINGS_ES` + `getCategoryStrings(lang)` → `getLocalizedCategoryName`, `getLocalizedDisciplineName`, `getLocalizedRoleName` |
| **eventCategories.ts** | `EVENT_CATEGORIES` | `EventCategory[]`: id → eventTypes[] → subtypes[] (solo IDs) | `EVENT_STRINGS_ES` + `getEventCategoryStrings(lang)` → `getLocalizedEventCategoryName`, por tipo y subtipo |
| **venueCategories.ts** | `PLACE_CATEGORIES` | `PlaceCategory[]`: id → subcategories[] (solo IDs) | `PLACE_STRINGS_ES` + `getLocalizedCategoryStrings(lang)` → `getLocalizedCategoryName`, `getLocalizedSubcategoryName` |
| **galleryCategories.ts** | `GALLERY_CATEGORIES` | `GalleryCategory[]`: id → subcategories[] (solo IDs) | `GALLERY_STRINGS_ES` (solo ES) → `getLocalizedGalleryCategoryName`, `getLocalizedGallerySubcategoryName` |

- **Estructura:** En los cuatro archivos la estructura son solo **IDs** (sin `name` en los tipos).
- **Etiquetas:** En archivos separados (diccionarios) por idioma; se obtienen con funciones `getLocalized*`.
- **Barrel:** `constants/index.ts` reexporta los cuatro módulos.

### 1.2 Patrones que no están unificados

| Aspecto | Artistas | Eventos | Salas (venues) | Galería |
|---------|----------|----------|----------------|----------|
| Nombre del tipo | `Category` | `EventCategory` | `PlaceCategory` | `GalleryCategory` |
| Nombre del array | `ARTIST_CATEGORIES` | `EVENT_CATEGORIES` | `PLACE_CATEGORIES` | `GALLERY_CATEGORIES` |
| Parámetro `lang` | Sí (`getCategoryStrings(id, lang)`) | Sí | Sí | No (solo ES) |
| Nombre del diccionario | `STRINGS_ES` | `EVENT_STRINGS_ES` | `PLACE_STRINGS_ES` | `GALLERY_STRINGS_ES` |
| “Venue” vs “Place” | — | — | Constantes usan **Place** | — |

---

## 2. Uso actual en la app

### 2.1 Dónde se usan

- **Explore:**  
  - `FiltersPanel`, `AdvancedFiltersPanel`, `FilterModal` → artistas.  
  - `EventFiltersPanel` → eventos.  
  - `VenueFiltersPanel` → salas (`PLACE_CATEGORIES`).  
  - `GalleryFiltersPanel` → galería.
- **Profile:**  
  - `CategorySelector` (ArtistCategorySelector), `CategoryModal`, `EditServiceModal` → artistas.
- **Auth/onboarding:**  
  - `ArtistFormScreen` → artistas (`ArtistCategorySelector`).
- **Favorites:**  
  - `FilterPanel` recibe `artistCategories`; `EventFilterPanel` recibe `categories`.  
  - En la práctica se les pasa una lista mock `professions` (strings como "Músico", "DJ", …), **no** las constantes de categorías.

### 2.2 Errores detectados (no unificado / incorrecto)

1. **Uso de `.name` en tipos que no lo tienen**  
   - `AdvancedFiltersPanel.tsx`:  
     `ARTIST_CATEGORIES.find(cat => cat.id === filters.category)?.name`  
     → `Category` no tiene `name`. Debe usarse `getLocalizedCategoryName(filters.category)`.
   - `VenueFiltersPanel.tsx`:  
     `(PLACE_CATEGORIES as PlaceCategory[]).find(c => c.id === category)?.name`  
     → `PlaceCategory` no tiene `name`. Debe usarse `getLocalizedCategoryName(category)`.

2. **Favorites no usa las constantes**  
   - Se pasa `professions` (array de strings) en lugar de `ARTIST_CATEGORIES` / `EVENT_CATEGORIES` con formato `{ value: id, label: getLocalized*(id) }`.

3. **FilterPanel / EventFilterPanel**  
   - `artistCategories = []` y `categories = []` por defecto, con comentarios “Pasar ARTIST_CATEGORIES” / “Pasar desde EVENT_CATEGORIES”. No están conectados a las constantes de forma centralizada.

---

## 3. Backend

- El backend está en el repo **artistas-app-backend** (no incluido en este workspace).
- **Decisión:** categorías con **IDs string** (slugs). El frontend ya está alineado:
  - `BackendArtist` y `UpdateArtistPayload` en `services/api/profile.ts` usan `categoryId`, `disciplineId`, `roleId` como **string**.
  - El formulario de artista envía los slugs de `ArtistCategorySelection` (ej. `artes-visuales`, `pintura`, `pintor`).
- Contrato para el backend: ver **docs/BACKEND-CONTRATO-CATEGORIAS.md**.

---

## 4. Qué falta para unificar

1. **Una sola capa de acceso en la app**  
   - Punto único desde el que cualquier pantalla obtiene:
     - Artistas: estructura + `getLocalizedCategoryName` (y disciplina/rol si aplica).
     - Eventos: estructura + `getLocalizedEventCategoryName` (y tipo/subtipo).
     - Salas: estructura + `getLocalizedCategoryName` / subcategoría (venueCategories).
     - Galería: estructura + `getLocalizedGalleryCategoryName` (y subcategoría).
   - Opción: un módulo `src/constants/categories/index.ts` (o `categories.ts`) que reexporte constantes y helpers con nombres coherentes.

2. **Misma convención de nombres**  
   - Misma forma de nombrar: “getDisplayName” o “getLocalized*Name” para categoría/tipo/subcategoría en los cuatro dominios.
   - Incluir `lang` también en galería para preparar i18n.

3. **Corregir usos incorrectos**  
   - Sustituir todo uso de `category.name` (o equivalente) por la función de localización correspondiente cuando el tipo estructural no tiene `name`.

4. **Favorites y filtros**  
   - Que FilterPanel y EventFilterPanel reciban (o importen) las listas derivadas de `ARTIST_CATEGORIES` y `EVENT_CATEGORIES` (por ejemplo `{ value: id, label: getLocalized*(id) }`) en lugar de listas mock.

5. **Backend**  
   - Definir en backend (o en documentación de API):
     - Si las categorías son **solo en backend** (IDs numéricos): mantener en frontend una **tabla de mapeo** string (UI) ↔ number (API) para artistas (y si aplica eventos/salas/galería).
     - Si se quiere **una sola fuente**: que el backend exponga o acepte los **mismos IDs string** que las constantes del frontend.

---

## 5. Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Está implementado en el backend como en el frontend? | No. El backend no está en este repo; el perfil artista usa `categoryId` numérico; el frontend usa solo IDs string. No hay alineación automática. |
| ¿Qué le falta al backend (o a la integración)? | Definir si categorías son numéricas (y entonces mapeo en frontend) o si el backend usa los mismos IDs string; y unificar nombres/contratos si hay endpoints de categorías. |
| ¿Qué hay que unificar en la app? | (1) No usar `.name` en tipos que no lo tienen; (2) un solo punto de uso de constantes + helpers; (3) misma convención de nombres y parámetro `lang`; (4) Favorites y filtros usando las constantes reales en lugar de mocks. |

Si quieres, el siguiente paso puede ser: (a) aplicar las correcciones de `.name` y conectar Favorites/FilterPanel a las constantes, y (b) esbozar el módulo unificado `categories` y la tabla de mapeo para el backend.
