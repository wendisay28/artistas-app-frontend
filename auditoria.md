SITUACIÓN ACTUAL:

Google Sign-In ya implementado en register.tsx — NO TOCAR
Funciona el botón "Continue with Google"
Sesión persistente con AsyncStorage pendiente
Colores: primary #E63946, background #FAFAFA
Tipografía: Plus Jakarta Sans

⚠️ NO modificar Google Auth. NO tocar dependencias de autenticación existentes.

FLUJO GENERAL AL ABRIR LA APP:
¿Hay sesión en AsyncStorage?
   ├─ SÍ → App directo (salta todo)
   ├─ Cerró sesión → LoginScreen (no WelcomeScreen)
   ├─ Token expirado → LoginScreen con mensaje suave
   └─ NO (primera vez) → WelcomeScreen

PANTALLA 1: WelcomeScreen.tsx (nueva)
Título: "¿Cómo quieres usar Buscart?"

[Card] 🔍 Soy Cliente — "Encuentra y contrata talento"
[Card] 🎨 Soy Artista — "Muestra tu trabajo y consigue clientes"

⚠️ SIN botón de login. SIN botón de registro. Solo las 2 cards.

Al tocar:
  Soy Cliente → LocationScreen
  Soy Artista → LoginScreen con Google

FLUJO CLIENTE — Paso a paso:
WelcomeScreen
   ↓
LocationScreen (ANTES del login — ubicación para ver artistas cercanos)
   ↓
ExploreScreen (ve artistas de su zona SIN estar logueado)
   ↓
Login con Google (solo al contratar, guardar o contactar)
   ↓
Home / App completa
PANTALLA: LocationScreen.tsx (compartida con artista)
Título: "¿Dónde te encuentras?"
Subtítulo: "Ayúdanos aLa respuesta de Claude fue interrumpidaReintentaresperame como si no hubieramos creado nada aun eso Google Sign-In ya implementado en register.tsx — NO TOCAR quitalo en lugar puedes decirle que audite lo que ya tenemos y lo mejore. tambien que no queremos emoticones sino iconos el color de ntonacion es morado claro vista clara no oscura diseño minimalista tiporedes como isntagram etc agrega esto a lo que taenemos1:01 p.m.BUSCART — FLUJO COMPLETO DE ONBOARDING
Especificación para implementación — Artista y Cliente

STACK Y CONTEXTO:

React Native + Expo Go
Autenticación: Firebase + Google Sign-In
Estado global: Zustand (authStore.ts)
Navegación: React Navigation
Colores: primary #7C3AED (morado), background #FAFAFA, texto #1A1A1A
Tipografía: Plus Jakarta Sans
Estilo: minimalista, limpio, redes sociales (referencia Instagram/Pinterest)
Iconos: librería de iconos (NO emojis) — usar Lucide o Ionicons
Sin fondos oscuros. Vista clara siempre.


TAREA INICIAL — AUDITORÍA:
Antes de crear cualquier archivo, audita lo que existe:
- register.tsx: revisar el flujo actual de Google Sign-In
- authStore.ts: revisar el estado de autenticación existente
- navigation: revisar el stack actual
- Identificar qué sirve, qué falta y qué hay que ajustar
- NO borrar ni reescribir lo que ya funciona
- Solo extender y complementar

FLUJO GENERAL AL ABRIR LA APP:
¿Hay sesión en AsyncStorage?
   ├─ SÍ → App directo (salta todo)
   ├─ Cerró sesión → LoginScreen (no WelcomeScreen)
   ├─ Token expirado → LoginScreen con mensaje suave
   └─ NO (primera vez) → WelcomeScreen

PANTALLA 1: WelcomeScreen.tsx (nueva)
Diseño: minimalista, fondo blanco, tipografía limpia
Título: "¿Cómo quieres usar Buscart?"

[Card] Icono búsqueda — "Soy Cliente"
       "Encuentra y contrata talento cerca de ti"

[Card] Icono pincel — "Soy Artista"
       "Muestra tu trabajo y consigue clientes"

⚠️ SIN botón de login. SIN botón de registro. Solo las 2 cards.

Al tocar:
  Soy Cliente → LocationScreen
  Soy Artista → LoginScreen con Google

PANTALLA 2: LocationScreen.tsx (compartida — misma para los dos)
Diseño: fondo blanco, inputs limpios estilo minimalista
Título: "¿Dónde te encuentras?"
Subtítulo: "Te mostramos artistas cerca de ti"

Inputs:
- País: dropdown. Default: Colombia
- Estado/Departamento: text input, requerido, mín 2 caracteres
- Ciudad: text input, requerido, mín 2 caracteres
- Botón GPS: icono ubicación + "Usar mi ubicación actual" (opcional)

Botón principal: "Continuar"

Al completar:
  Si viene de Cliente → ExploreScreen
  Si viene de Artista → ArtistFormScreen

FLUJO CLIENTE — Paso a paso:
WelcomeScreen
   ↓
LocationScreen (ubicación para ver artistas cercanos)
   ↓
ExploreScreen (ve artistas de su zona SIN login)
   ↓
Login con Google (solo al contratar, guardar o contactar)
   ↓
Home / App completa
PANTALLA: ExploreScreen.tsx (nueva)
- Feed estilo Instagram/Pinterest — grid o lista de artistas
- Filtrado por la ubicación ingresada
- Solo muestra perfiles con ≥ 80% completado
- Sin login para explorar
- Login se pide solo al: contratar / guardar / contactar
PANTALLA: ClientProfileScreen.tsx (nueva)
- Foto y nombre tomados de Google automáticamente
- Mensaje único (1 sola vez):
  "Tu foto y nombre vienen de Google — puedes editarlos aquí"
- Botón editar: opcional, sin presión
- Cerrar sesión: desde Configuración, nunca desde inicio

FLUJO ARTISTA — Paso a paso:
WelcomeScreen
   ↓
LoginScreen con Google (obligatorio)
   ↓
LocationScreen (misma pantalla, guarda ciudad del artista)
   ↓
Backend verifica:
  ├─ Usuario ya existe → Home directo ✅
  └─ Usuario nuevo → ArtistFormScreen
         ↓
    Completa formulario (regla del 80%)
         ↓
    Publica perfil → aparece en ExploreScreen ✅
PANTALLA: ArtistFormScreen.tsx (nueva)
Diseño: formulario paso a paso, barra de progreso superior
Estilo: limpio, minimalista, sin scroll infinito

Campo               %     Tipo
──────────────────────────────────────────
Foto de perfil      20%   Image picker
Nombre artístico    15%   Text input
Categoría           20%   Selector dropdown
Descripción         15%   Text area
Ciudad              10%   Se toma de LocationScreen
1 foto de trabajo   20%   Image picker múltiple

Comportamiento:
- Barra de progreso visible y en tiempo real
- Mientras < 80%: banner superior "Tu perfil no es visible aún — falta X%"
- Al llegar al 80%: se habilita botón "Publicar perfil"
- Texto incentivo: "Los artistas con perfil completo reciben 3x más contactos"
- Puede navegar la app pero NO aparece en Explorar hasta publicar
⚠️ Esto es una REGLA del sistema, no una recomendación
PANTALLA: ArtistProfileScreen.tsx (nueva)
- Foto: la que subió en el formulario
- Nombre: nombre artístico
- Categoría: tag visible
- Descripción: texto completo
- Galería de fotos de trabajo
- Botón editar: abre ArtistFormScreen en modo edición
- Badge: "Visible" o "No visible aún" según % completado

LÓGICA DE AUTENTICACIÓN:
typescriptasync function handleGoogleSignIn() {
  const googleUser = await signInWithGoogle(); // auditar, no reescribir

  const response = await api.get('/auth/me');

  if (response.data) {
    navigation.navigate('Home'); // ya existe → directo
  } else {
    navigation.navigate('WelcomeScreen'); // nuevo → flujo completo
  }
}
Datos temporales antes de completar registro:
typescript{ firebaseUid, email, name, profileImage, userType, location }
// userType: 'client' | 'artist'
// NO crear en backend hasta tener TODO
Al completar registro:
typescriptawait api.post('/auth/register', {
  firebaseUid, email, name, profileImage,
  userType: tempData.userType,
  location: { country, state, city }
});
navigation.navigate('Home');
Sesión persistente — useAuth.js:
typescript// Guardar en AsyncStorage al login exitoso:
{ googleId, email, name, photo, type }

// ⚠️ NO guardar token de Google. Solo datos del perfil.
```

---

**ARCHIVOS:**
```
useAuth.js                  NUEVO      Sesión persistente AsyncStorage
WelcomeScreen.tsx           NUEVO      2 cards sin login visible
LocationScreen.tsx          NUEVO      Compartida cliente y artista
ExploreScreen.tsx           NUEVO      Grid/lista artistas por zona
ArtistFormScreen.tsx        NUEVO      Formulario con regla del 80%
ArtistProfileScreen.tsx     NUEVO      Vista pública + badge visibilidad
ClientProfileScreen.tsx     NUEVO      Perfil cliente editable
store/authStore.ts          AUDITAR    Extender, no reescribir
navigation/AuthStack        AUDITAR    Agregar nuevas pantallas
register.tsx                AUDITAR    Revisar Google Auth, no romper
```

---

**REGLAS QUE NO SE NEGOCIAN:**
```
1. Auditar antes de crear — no romper lo que ya funciona
2. NO crear usuario en backend hasta tener TODOS los datos
3. Artista NO aparece en Explorar hasta el 80% completado
4. Cliente NO ve login hasta querer hacer una acción concreta
5. WelcomeScreen nunca tiene login ni registro visible
6. Ubicación es obligatoria para los dos tipos de usuario
7. Cerrar sesión solo desde Configuración
8. Sin emojis — usar iconos de Lucide o Ionicons
9. Diseño minimalista, fondo claro, sin vistas oscuras
10. Si cancela a mitad → guardar progreso en AsyncStorage