# Contrato API: categorías con IDs string

El backend del proyecto está en el repo **artistas-app-backend**. Este documento describe cómo el frontend espera que las categorías (artistas, eventos, salas, galería) se manejen en la API.

## Decisión: IDs string (slugs)

Todas las categorías usan **IDs string** (slugs), no números:

- Misma fuente de verdad que las constantes del frontend (`src/constants/artistCategories.ts`, `eventCategories.ts`, `venueCategories.ts`, `galleryCategories.ts`).
- Sin tablas de mapeo entre frontend y backend.
- Legibles en URLs y respuestas: `categoryId: "pintura"`, `?category=artes-visuales`.

## Artistas (perfil artista)

### Payload al crear/actualizar artista

El frontend envía en `PUT /artist/me` (o equivalente):

```json
{
  "artistName": "María García",
  "stageName": "María García",
  "description": "...",
  "categoryId": "artes-visuales",
  "disciplineId": "pintura",
  "roleId": "pintor"
}
```

- **categoryId**: ID de categoría (ej. `artes-visuales`, `musica`). Valores definidos en `ARTIST_CATEGORIES` (artistCategories.ts).
- **disciplineId**: ID de disciplina dentro de la categoría (ej. `pintura`, `escultura`).
- **roleId**: ID de rol dentro de la disciplina (ej. `pintor`, `ilustrador`).

### Respuesta del backend

El frontend espera que el artista pueda devolverse con los mismos IDs string:

```json
{
  "artist": {
    "id": 1,
    "userId": "...",
    "artistName": "María García",
    "categoryId": "artes-visuales",
    "disciplineId": "pintura",
    "roleId": "pintor",
    "description": "..."
  },
  "category": {
    "id": "artes-visuales",
    "name": "Artes visuales y plásticas"
  }
}
```

Opcional: si el backend prefiere guardar un `id` numérico interno, puede seguir exponiendo en la API **solo los string** (categoryId, disciplineId, roleId) para que el frontend no necesite mapear.

### Validación en backend

- Aceptar solo valores que existan en la taxonomía. El frontend puede exportar o compartir la lista de IDs válidos (por ejemplo desde `artistCategories.ts`) para que el backend valide.
- Si se envía un ID desconocido: responder `400` con mensaje claro.

## Eventos, salas (venues), galería

Misma idea:

- **Eventos**: IDs de `EVENT_CATEGORIES` (categoría, tipo, subtipo). Ej. `categoryId: "music"`, `typeId: "concerts"`, `subtypeId: "rock"`.
- **Salas/lugares**: IDs de `PLACE_CATEGORIES` (venueCategories). Ej. `categoryId: "event-spaces"`, `subcategoryId: "event-halls"`.
- **Galería**: IDs de `GALLERY_CATEGORIES`. Ej. `categoryId: "painting"`, `subcategoryId: "oil"`.

En la API, usar siempre **string** para estos IDs (no number).

## Repo del backend

- **Nombre del repo:** `artistas-app-backend` (mismo workspace que el frontend).
- **PUT /artist/me** ya acepta `categoryId`, `disciplineId`, `roleId` como **string** (códigos). El backend resuelve código → ID numérico interno con `utils/hierarchy-codes.js` y guarda los integer en la BD.
- **Filtros** (ej. listado de artistas): el parámetro `category` puede ser código string (ej. `?category=artes-visuales`); el storage filtra por `categories.code`.
