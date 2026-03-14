Aquí tienes el documento maestro totalmente integrado, pulido y organizado. Este es el **Blueprint definitivo de BuscArt Events** que combina la estética de Luma con tu infraestructura logística.

Copia este texto y entrégaselo a tu IA de desarrollo como la "Única fuente de verdad" para el módulo de eventos.

---

# 🎟️ BLUEPRINT MAESTRO: BUSCART EVENTS (COMPETENCIA LUMA)

## 1. Visión General

Transformar la sección de eventos en una herramienta de comunidad estética y funcional. El objetivo es que la creación sea **fricción cero** para el organizador, el descubrimiento sea **orgánico** para el usuario y la retención sea **automática**.

## 2. Modelo de Negocio y Comisiones (Competitividad)

Para igualar el estándar de Luma y atraer organizadores, la estructura de pagos en Stripe será:

* **Comisión BuscArt:** 5% (Fija por ticket vendido).
* **Comisión Pasarela (Stripe):** ~2.9% + $0.30 USD.
* **Eventos Gratuitos:** 0% comisión.
* **Transparencia:** El sistema permite al organizador elegir si absorbe la comisión o la traslada al cliente como un "Service Fee".

---

## 3. Experiencia de Usuario (UI/UX) - Estilo Luma

### A. La Landing Page del Evento

Diseño minimalista y visualmente atractivo que incluye:

* **Header Premium:** Imagen o video en loop que define la atmósfera.
* **Información Vital:** Título, fecha, hora y ubicación con enlace directo a Maps.
* **Social Proof (Efecto Comunidad):** Burbujas de fotos de perfil de asistentes actuales ("X personas asistirán"). *Incluir switch de privacidad para usuarios que deseen asistir de incógnito.*
* **El "Vibe":** Descripción rica en formato (negritas, fotos, emojis).
* **Botón Sticky:** Botón de "Comprar/Reservar" siempre visible al hacer scroll.

### B. Checkout One-Tap

* Integración con **Stripe Checkout** (Apple Pay / Google Pay).
* Registro automático usando los datos del perfil de BuscArt para eliminar formularios innecesarios.

---

## 4. Gestión y Colaboración (Dashboard Pro)

### A. Herramientas del Organizador

* **Gestión de Invitados:** Panel de control para ver aprobados, pendientes y analíticas de ventas.
* **Aprobación Manual:** Opción para eventos exclusivos donde el organizador valida al asistente antes de confirmar el ticket.
* **Gestión de Co-hosts:** Capacidad de añadir "Co-organizadores" para que el evento aparezca en ambos perfiles y ambos puedan gestionar el acceso.
* **Modo Scanner:** Herramienta nativa para validar tickets QR en la puerta.

### B. Comunicación y Retención

* **Event Blasts:** Envío de mensajes rápidos (Push/Email) a todos los asistentes ("¡Ya abrimos puertas!", "Show en 10 min").
* **Botón de Follow:** Los usuarios pueden seguir al organizador directamente desde el evento para recibir alertas de futuras fechas.

---

## 5. Integraciones y Logística

### A. Automatización de Calendario y Tickets

* **Add to Wallet:** Botones para añadir a Google/Apple Calendar inmediatamente tras la compra.
* **Recordatorios Inteligentes:** Notificaciones automáticas 24 horas y 2 horas antes del inicio.
* **Tickets QR:** Generación de código único enviado por email y guardado en la sección "Mis Eventos" de la app.

### B. Logística Silenciosa (Back-office)

* **Check-in GPS del Artista:** Visible **únicamente** para el organizador.
* **Alerta de Retraso Privada:** Si el artista no llega al radio de ubicación 15 min antes, se notifica al organizador para gestión interna. **No se alerta al público.**

### C. Vinculación Artista-Evento

* Los perfiles de los artistas contratados aparecen destacados en la página del evento para fomentar su contratación directa por otros usuarios.

---

## 6. Smart Data y Post-Evento

### A. Analíticas para el Creador

Panel con métricas clave:

* **Conversión:** Visitas a la página vs. Tickets vendidos.
* **Comportamiento:** Horas pico de compra e insights de retención ("El 60% son fans recurrentes").

### B. Feedback Loop (Cierre de Ciclo)

* **Reseñas Automáticas:** 24 horas después, el sistema solicita calificación del evento.
* **Impacto de Reputación:** Los comentarios alimentan el **Score de Hospitalidad** (Empresa) y el perfil del Artista de forma orgánica.

---

## 7. Políticas de Cancelación y Reembolso

* **Cancelación por Organizador:** Reembolso automático del 100% y penalización de reputación al perfil.
* **Cancelación por Asistente:**
* **> 48h antes:** Reembolso del 80% (20% queda en BuscArt por costos de infraestructura).
* **< 24h antes:** No hay reembolso (Protección de la taquilla del creador).



---

**Instrucción para la IA de Desarrollo:**
*"Implementa este Blueprint priorizando la limpieza visual de Luma y la solidez de Stripe Connect. Asegúrate de que las tablas de eventos, asistentes y co-hosts estén relacionadas correctamente con la tabla de usuarios y reputación."*

🚀 FASE 2: ESTRATEGIA DE DENSIDAD Y SCRAPING INTELIGENTE1. Clasificación de Inventario (Dualidad del Feed)Para mantener la confianza del usuario, el explorador dividirá los eventos en dos categorías técnicas en la base de datos:AtributoEventos BuscArt (Nativos)Eventos Explorador (Agregados)OrigenCreados por Artistas/Empresas en la app.Scrapeados por IA de fuentes externas.TransacciónPago por Stripe dentro de BuscArt.Botón "Ver más" (Redirección externa).GarantíaProtegidos por infraestructura BuscArt."Información de terceros - No verificada".Badge UISello Dorado / "Verificado".Sello Gris / "Evento Externo".2. Plan de Scraping: Fuentes Críticas de MedellínTu IA de recolección de datos (Scraper) debe enfocarse en estas 5 fuentes que concentran el 80% de la cultura en la ciudad:Entidades Culturales (Comfama / Comfenalco): Tienen las agendas más organizadas de teatros y parques.Teatros Independientes: (Teatro Pablo Tobón Uribe, Matacandelas, Pequeño Teatro). Sus sitios web son minas de oro de eventos programados.Bares y Cafés Culturales (Vía Instagram): La IA debe rastrear cuentas clave de El Poblado y Laureles (ej. Perfiles de música en vivo, jazz bars).Plataformas de Ticketing Locales: (La Tiquetera, Eticket, etc.) para eventos masivos.Páginas Oficiales de Alcaldía: (Medellín.travel / Agenda Cultural Medellín).3. El Flujo de Conversión: "Claim Your Event"Aquí es donde la Fase 2 alimenta a la Fase 1. En cada evento scrapeado, aparecerá un banner:"¿Eres el organizador de este evento? Pásate a BuscArt Premium para vender tus entradas con el 5% de comisión y aparecer en los primeros lugares."Acción: El dueño reclama el evento.Conversión: Al reclamarlo, debe completar su perfil, conectar Stripe y aceptar el Sello de Excelencia Operativa.Resultado: Conviertes contenido gratuito en un cliente que paga comisión.4. Implementación Técnica (Para tu IA de Desarrollo)A. El "Buffer" de ValidaciónNo publiques lo scrapeado directamente. Crea una tabla intermedia llamada Pending_Events.La IA extrae: Nombre, Fecha, Lugar, Precio y Link.Un moderador (o una IA de lenguaje) limpia el texto y asigna categorías (Música, Teatro, Taller).B. El Motor de Actualización (Cron Jobs)Los eventos externos son volátiles. Tu IA debe:Verificar Disponibilidad: Cada 12 horas revisar si el link original sigue activo.Eliminar Caducados: Si el evento desapareció de la fuente original, marcar como "Cancelado/Finalizado" en BuscArt.5. Blueprint Actualizado (Fase 2 Integrada)Copia esto para tu IA de desarrollo como complemento del Blueprint anterior:Markdown### MÓDULO: CONTENT AGGREGATION & ACQUISITION (FASE 2)

1. **Scraper Engine:** Implementar scripts de extracción para [Lista de Fuentes de Medellín].
2. **External Event Model:** Crear tabla 'External_Events' con campos: source_url, original_organizer, scrap_date.
3. **UI/UX Distinction:** Los eventos externos no muestran el botón de "Comprar QR", muestran un botón de "Ir a Fuente Original" con un disclaimer de responsabilidad.
4. **Lead Generation Tool:** Implementar el botón "Reclamar este Evento". Al hacer clic, inicia el flujo de Onboarding de Empresa/Artista Verificado.
5. **SEO & Link Building:** Generar páginas de eventos indexables para que cuando alguien busque "Eventos Medellín hoy", lleguen a BuscArt.
