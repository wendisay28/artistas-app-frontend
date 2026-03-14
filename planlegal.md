📜 Plan de Trabajo Final: Infraestructura BuscArt 2026
1. Definición del Problema y Propósito
Problema: Falta de infraestructura logística en el arte.
Solución: Web responsive para buscar, comparar y contratar talento emergente con un sistema de cumplimiento mutuo (Escrow) y blindaje profesional.

2. Flujo Crítico de Contratación (Detallado)
A. El "Clic" de Contratación
Acción: El cliente oprime "Contratar" en la tarjeta o perfil.

Modal Dinámico:

Presencial: Pide fecha, hora, duración y dirección.

Digital (UGC/Edición): Pide fecha límite de entrega, brief y dirección de envío de producto (si aplica).

Pago Escrow (Stripe): El cliente paga el 100%. BuscArt retiene el dinero. El artista tiene un tiempo límite para aceptar (ej. 12h) o el dinero se devuelve automáticamente.

B. El Chat de Documentación (BuscArt Messenger)
Se abre al aceptar la oferta.

Función: Registro legal de acuerdos.

Acuerdos Externos: Si hablan por teléfono o en persona, el artista debe usar el botón "Registrar Acuerdo Verbal" en el chat para que la IA lo valide con el cliente y tenga peso legal en una disputa.

3. Logística de Cumplimiento y Tiempos
Protocolo de Inicio (Presencial): * Artista: 30 min antes para montaje. 20 min de gracia técnica (compensada al final).

Cliente: 15 min máximo para atención inicial.

Tareas de Compensación: Si el artista llega tarde, la IA activa obligatoriamente la entrega de Contenido Extra (Stories/Post) para compensar al negocio.

Entrega Digital (UGC):

El artista entrega un link externo (Drive/WeTransfer).

Rondas: 1 ronda de ajustes menores incluida.

4. Módulo de Disputas (Lo que faltaba)
Si el cliente o el artista no están de acuerdo con la finalización:

Botón de Disputa: Se habilita si el QR no se escanea o si el contenido digital es rechazado tras la ronda de ajustes.

Evidencia: La IA recopila: Logs de Chat, GPS de Check-in, y links de entrega.

Resolución Humana/IA: * Si el artista no hizo Check-in y no entregó: Devolución 100% y Veto.

Si el artista cumplió pero al cliente "no le gustó" subjetivamente: Pago al artista (el arte es subjetivo, el cumplimiento es objetivo).

Si el artista consumió (restaurante) y no entregó: Veto y Deuda Ética.

5. Finalización y Reputación
Cierre Presencial: Escaneo de Código QR.

Cierre Digital: Aprobación del cliente o 48h de silencio (Aprobación tácita).

Propinas: 100% para el artista, procesadas por Stripe post-servicio.

Sellos de Excelencia: * Artista: Score basado en cumplimiento y talento.

Empresa: Sello de "Excelencia Operativa" (Hospitalidad y seriedad).

6. Mapa de la Aplicación (Sitemap)
Inicio: Feed de comunidad (muro de publicaciones).

Explorar: Interfaz Swipe (Tinder) para descubrir talento.

Contratar: Dashboard de contratos activos y ofertas enviadas/recibidas.

Favoritos: Lista de guardados.

Perfil: Portafolio (IG Style) y configuración de servicios/precios.

Explorar Sitios: Marketplace de salones, estudios y locaciones (Infraestructura física).

7. Políticas de Rigor (Resumen)
Regla 50/50: Cancelación < 24h = El artista recibe el 50%.

Fuerza Mayor: Botón de emergencia para pausar plazos sin penalización (requiere soporte).

Veto por "Mamar gallo": Incumplimiento de entrega tras consumo presencial = Expulsión y deuda registrada.

Nota para la IA de Desarrollo:
Este documento es la única fuente de verdad para la lógica de negocio. Prioriza la seguridad de los webhooks de Stripe y la precisión del sistema de estados del contrato (Pending -> Secured -> Active -> Completed/Disputed).

🏛️ DOCUMENTO MAESTRO LEGAL Y OPERATIVO - BUSCART 2026
Propósito del Documento: Proveer la arquitectura legal, las reglas de negocio (Business Logic) y los términos de servicio que regirán las interacciones entre Clientes, Artistas y la Plataforma BuscArt. Esta es la fuente única de verdad para la programación de Smart Contracts, Webhooks de pago y flujos de usuario.

MÓDULO 1: ACUERDO DE TÉRMINOS Y CONDICIONES (T&C)
Aceptación obligatoria al crear una cuenta en BuscArt.

1.1. Naturaleza de la Plataforma
BuscArt opera exclusivamente como una infraestructura tecnológica y logística que facilita la conexión, formalización y procesamiento de pagos entre Usuarios Contratantes (Clientes/Empresas) y Creadores de Contenido/Talento (Artistas). BuscArt no funge como empleador, agencia de representación, ni asume responsabilidad laboral sobre los Artistas.

1.2. Estructura de Tarifas y Comisiones
Por el uso de la infraestructura, el blindaje de contratos y el procesamiento de pagos (Escrow), BuscArt aplica una tarifa de intermediación tecnológica a cada transacción finalizada con éxito.

[Nota Exclusiva para la IA de Desarrollo: El sistema debe calcular y retener automáticamente un fee del 15% sobre el valor total bruto de cada contrato al momento del desembolso (Payout) en Stripe. Este porcentaje es invisible en la interfaz de "Cobro al Cliente", presentándose como una tarifa de servicio unificada].

1.3. Política de Cancelación (Regla 50/50)
Cualquier cancelación realizada por el Cliente con menos de 24 horas de anticipación al inicio pactado del servicio (o fecha de entrega para UGC), generará un cobro automático del 50% del valor total en favor del Artista por concepto de "Reserva de Agenda y Lucro Cesante". El 50% restante será reembolsado al Cliente. Cancelaciones previas a 24 horas tendrán reembolso total.

1.4. Cláusula de No Exclusividad y Retención en Plataforma
BuscArt no exige exclusividad. El Artista es libre de comercializar su talento en otros canales. Sin embargo, se establece una política estricta de Protección de Transacción: Cualquier servicio que sea contactado, negociado o iniciado dentro del ecosistema de BuscArt debe finalizarse y pagarse a través de la plataforma. La incitación a desviar pagos a canales externos (efectivo, transferencias directas) resultará en la suspensión inmediata y permanente de las cuentas implicadas.

1.5. Protocolo de Rigor y Sanción por Incumplimiento (Servicios Presenciales y UGC)
Si un Artista acepta un servicio que incluye el consumo de bienes o servicios (ej. alimentos en un restaurante, hospedaje, productos físicos) bajo la promesa de entrega de contenido (UGC) o show en vivo, y este no cumple con la entrega en el plazo estipulado en el Contrato Dinámico:

Se aplicará un Veto Permanente en la plataforma.

BuscArt registrará una Deuda Operativa equivalente al valor comercial del bien consumido, la cual deberá ser saldada como condición única para considerar la reactivación de la cuenta.

El dinero retenido en garantía (Escrow) será reembolsado al 100% al Cliente.

MÓDULO 2: EL CONTRATO DINÁMICO DE PRESTACIÓN DE SERVICIOS
Este contrato se genera, sella y almacena en la base de datos cada vez que el Cliente oprime "Pagar y Enviar Oferta", y entra en vigor cuando el Artista oprime "Aceptar".

Estructura del Contrato (Data Model Base):

ID_Contrato: Hash único de transacción.

Partes Involucradas: ID_Cliente vs. ID_Artista.

Objeto del Contrato: [Descripción del brief / Tipo de Servicio].

Coordenadas Logísticas: Ubicación GPS exacta y Fecha/Hora de inicio.

Obligaciones del Artista:

Llegar 30 minutos antes de la hora de inicio estipulada para procesos de montaje y adecuación.

Realizar el Check-in mediante geolocalización en la App.

(Si es UGC): Entregar el material finalizado en un plazo máximo de [X] horas mediante enlace de descarga seguro, incluyendo una (1) ronda de ajustes menores sin costo adicional.

Obligaciones del Cliente (Hospitalidad):

Garantizar la recepción y asignación de espacio de trabajo al Artista en un plazo no mayor a 15 minutos tras el Check-in.

Proveer los requerimientos técnicos pre-aprobados en el Checklist de la oferta.

Resolución de Fallas (Margen de Gracia): Se otorgan 20 minutos de gracia técnica al Artista para solucionar imprevistos (cables, conexión, software). Este tiempo deberá ser compensado al final del servicio (o mediante contenido extra).

MÓDULO 3: POLÍTICA DE PRIVACIDAD Y MANEJO DE DATOS
3.1. Geolocalización Restringida (GPS)
BuscArt solo accederá a la ubicación del Artista de forma activa durante la ventana operativa del servicio (desde 1 hora antes del evento hasta el escaneo del Código QR de finalización). Su único fin es habilitar el botón de "Check-in Logístico" y proteger a ambas partes en caso de disputa por inasistencia. No se realiza rastreo en segundo plano fuera de contratos activos.

3.2. Identidad Verificada (KYC)
Para garantizar un ecosistema libre de fraudes, todos los Artistas y Empresas Aliadas deben pasar por un proceso de Know Your Customer (KYC) operado por nuestro proveedor de pagos (Stripe), que incluye verificación de documento de identidad oficial. BuscArt no almacena documentos financieros en sus servidores propios.

3.3. Monitoreo de Comunicaciones (BuscArt Messenger)
Los mensajes intercambiados en el chat interno son monitoreados algorítmicamente para detectar intentos de fraude, evasión de plataforma o acoso. En caso de abrirse un Ticket de Disputa, el historial del chat será la única prueba válida para la mediación. Acuerdos verbales no registrados a través de la función "Registrar Acuerdo" en el chat carecen de validez legal para BuscArt.

MÓDULO 4: ONBOARDING Y CHECKLIST DE PROFESIONALIZACIÓN
Pantallas obligatorias (UI/UX) que el usuario debe marcar (Check) antes de poder publicar su primer servicio u oferta.

4.1. Manifiesto del Artista BuscArt (Onboarding Artistas)
[ ] El Arte es un Negocio: Entiendo que al aceptar una oferta, estoy firmando un contrato vinculante. Mi reputación y mi cumplimiento son mi mayor activo.

[ ] La Puntualidad es mi Firma: Me comprometo a llegar 30 minutos antes para mi montaje. Entiendo que los 20 minutos de gracia son exclusivos para fallas técnicas, no para retrasos injustificados.

[ ] Protección por Escrito: Comprendo que cualquier cambio de precio, horario o entregables debe registrarse en el BuscArt Messenger. Lo que no está escrito en la plataforma, no está protegido por la garantía de pagos.

[ ] Ética de Intercambio (UGC): Acepto que si soy contratado para crear contenido a cambio de una experiencia (ej. restaurante, hotel), la falta de entrega del material audiovisual resultará en mi expulsión de la plataforma y el cobro del consumo.

4.2. Compromiso de Excelencia Operativa (Onboarding Empresas/Clientes)
[ ] Atención Ágil: Me comprometo a recibir al talento en menos de 15 minutos desde su llegada. Entiendo que un artista bien recibido entrega un producto superior.

[ ] Condiciones Dignas: Garantizo un espacio físico adecuado, seguro y con los requerimientos técnicos básicos para que el profesional ejecute su labor.

[ ] Garantía de Pago (Escrow): Entiendo que el pago se retiene de forma segura al enviar la oferta y se libera automáticamente al Artista al escanear el QR de finalización o al aprobar el material digital.

[ ] Respeto Profesional: Comprendo que contrato a un aliado estratégico para mi marca, sujeto a los tiempos y entregables definidos en el Contrato Dinámico.