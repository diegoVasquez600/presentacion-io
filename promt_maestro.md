# ESPECIFICACIONES TÉCNICAS: OVERHAUL DE LA WEB APP DE INVESTIGACIÓN DE OPERACIONES
## OBJETIVO: Transformar la interfaz actual en una plataforma de presentación interactiva de nivel de producción ("Production-Ready"), interactiva y gamificada para la sustentación final.

---

### 1. DIRECTIVAS GLOBALES DE DISEÑO Y UI/UX
* **Limpieza Absoluta:** Eliminar cualquier comentario informal en el HTML/JSX, textos de prueba ("Lorem Ipsum") o notas internas. Todo el contenido debe ser formal, técnico y pulido.
* **Maximización del Espacio (Real Estate):** La sección interactiva principal debe dominar la pantalla (`w-full h-[85vh]` o similar). Reducir contenedores anidados innecesarios, paddings excesivos o tarjetas pequeñas. Los mapas y grafos deben expandirse al máximo disponible.
* **Componentes de Identidad:** Añadir un encabezado/navbar superior elegante y colapsable donde se muestre el título del proyecto y una sección dedicada a los créditos del equipo de ingeniería (Nombres, Código y Área de Formación).
* **Tecnología:** React, Tailwind CSS, Lucide Icons, Framer Motion (opcional para transiciones suaves), React Flow (para el grafo). Todo tipado estrictamente en TypeScript.

---

### 2. SECCIÓN 1: COMPONENTE DE PORTADA Y ARQUITECTURA DEL SISTEMA
* **Visualización del Ecosistema:** Diseñar un Dashboard tecnológico que simule la centralización de datos del proyecto real (Plataforma Abierta de Datos Agrícolas).
* **Secciones Clave:** Mostrar tarjetas interactivas de:
  1. Nodos Terrestres LoRaWAN (Monitoreo de Suelo y Clima tipo SIATA).
  2. Estación Móvil Aérea (Dron de Código Abierto para imágenes multiespectrales).
  3. Núcleo de Gestión Descentralizado (Instancia de Odoo ERP autoalojada en Servidor VPS).
  4. Capa de Inteligencia Artificial (Algoritmo de interpolación estadística y analítica predictiva).

---

### 3. SECCIÓN 2: JUEGO INTERACTIVO PERT-CPM (EL LABERINTO DE LA RUTA CRÍTICA)
* **El Objetivo del Juego:** La clase debe participar activamente intentando encontrar los caminos y adivinar la Ruta Crítica antes de que el sistema la revele.
* **Requisitos del Grafo (React Flow / Custom SVG Canvas):**
  - Renderizar de forma fluida y a gran escala la red de 22 nodos (incluyendo los nodos formales de 'Inicio' y 'Fin').
  - Cada nodo debe representarse visualmente con la estructura académica clásica en cruz/círculo dividido:
    * Centro: ID de la Actividad (A, B, C...).
    * Arriba Centro: Duración ($t$).
    * Abajo Centro: Holgura ($H$) -> **OCULTA POR DEFECTO** (mostrar un signo de interrogación `?` o candado).
    * Cuadrantes Superiores: Inicio Próximo (IP) y Terminación Próxima (TP).
    * Cuadrantes Inferiores: Inicio Lejano (IL) y Terminación Lejano (TL) -> **OCULTOS POR DEFECTO**.
* **Mecánica de Gamificación e Interactividad:**
  - **Modo Selección de Caminos:** Al hacer clic en un nodo, este y sus conexiones directas (flechas entrantes y salientes) deben iluminarse con un color distintivo (azul o naranja), opacando el resto de la red. Esto permite visualizar los diferentes caminos lógicos del despliegue tecnológico.
  - **Sistema de Puntuación de la Clase:** Añadir botones interactivos de selección rápida para que la clase vote por cuál es el camino de la ruta crítica.
  - **Botón "Revelar Holguras y Ruta Crítica":** Al accionarse, ejecuta una animación donde los cuadrantes ocultos se revelan, los signos de interrogación desaparecen para mostrar los valores reales de holgura ($H$) y las aristas de la auténtica Ruta Crítica brillan de forma animada en color Rojo Carmesí.

---

### 4. SECCIÓN 3: COMPONENTE DE CRONOGRAMA INTERACTIVO (GANTT)
* **Diseño del Timeline:** Una sección donde el eje vertical muestra la lista estructurada de las tareas de ingeniería (con su costo en COP y recurso asignado) y el eje horizontal representa la línea temporal.
* **Funcionalidad Avanzada:**
  - **Control Deslizante de Tiempo (Slider):** Un control interactivo en la parte superior para seleccionar el "Día Actual" de la simulación. Al mover el slider, las barras de las tareas correspondientes a ese día deben cambiar de estado visual (ej. parpadear o iluminarse en verde si están activas en ejecución).
  - **Tooltips Informativos:** Al pasar el mouse por encima de cada barra, desplegar un modal flotante con la descripción detallada del hito técnico, sus predecesores y su presupuesto asignado.

---

### 5. SECCIÓN 4: MODELO DE TRANSPORTE Y MINIJUEGO DE ASIGNACIÓN ENERGÉTICA
* **Contexto Técnico:** Optimización de la autonomía del dron comunal de bajo costo. Asignación de minutos de batería disponibles desde 4 Gateways/Estaciones de Carga (Fuentes) hacia 3 Fincas Agrícolas que requieren captura de imágenes multiespectrales para la IA (Destinos).
* **El Tablero de Control / Interfaz Dividida:**
  - **Lado Izquierdo (El Mapa de Simulación):** Un mapa visual estilizado basado en cuadrícula o lienzo verde. Debe renderizar iconos para los 4 Gateways LoRaWAN y los 3 Sectores de Cultivo. Debe incluir un objeto móvil que represente el Dron.
  - **Lado Derecho (Matriz Dinámica de Inputs):** Una tabla formal de transporte ($4 \times 3$) donde la clase puede digitar manualmente cuántos minutos de batería enviar desde cada estación a cada cultivo.
* **Mecánica de Entrada y Validación en Tiempo Real:**
  - Cada celda debe contar con su costo unitario de transporte (distancia/desplazamiento en la esquina superior).
  - Al ingresar números en los inputs, el Dron del mapa del lado izquierdo debe ejecutar una animación de traslado físico suave entre el origen y el destino seleccionado, dibujando una línea punteada que conecte los puntos.
  - El sistema debe validar de forma reactiva las restricciones: si la asignación manual supera la Oferta del Gateway o la Demanda de la Finca, la celda o el texto de advertencia debe ponerse en rojo brillante.
  - Mantener un marcador dinámico en tiempo real que calcule el Costo Total actual: $Z = \sum (Cantidad \times Costo)$.
* **El Panel Comparativo de Métodos Matemáticos:**
  Añadir una sección de pestañas o botones para contrastar el intento interactivo de la clase con las soluciones algorítmicas exactas de Investigación de Operaciones:
  1. **Método de Costo Mínimo:** Carga de forma estática los resultados de este criterio heurístico en la matriz.
  2. **Método de Aproximación de Vogel (VAM):** Muestra la penalización por filas y columnas y la asignación resultante.
  3. **Solución Óptima (Solver / Simplex):** Revela la distribución matemáticamente perfecta que garantiza el costo mínimo absoluto de consumo energético ($Z = 5.970 \text{ mAh}$), disparando una animación donde el dron recorre el mapa optimizado y muestra un aviso de éxito en pantalla.

---

### 6. ESTRUCTURA DE DATOS (TABLA MAESTRA Y JSON)

#### 6.1 Generación Dinámica del PERT-CPM:
**INSTRUCCIÓN PARA EL LLM:** Genera el estado JSON de las tareas a partir de la siguiente tabla. Debes incluir lógicamente un nodo "Inicio" (predecesor de A) y un nodo "Fin" (sucesor de T). Calcula automáticamente los valores matemáticos de PERT-CPM requeridos para el grafo: Inicio Próximo (IP), Terminación Próxima (TP), Inicio Lejano (IL), Terminación Lejana (TL) y Holgura (H).

| ID | Actividad y Descripción | Predecesora | Tiempo | Costo (COP) | Recursos Asignados |
| :--- | :--- | :---: | :---: | :--- | :--- |
| A | Definición de requerimientos: Especificaciones del hardware IoT, dron, IA y topología LoRaWAN. | - | 3 días | $ 300.000 | Ing. de Sistemas/Hardware |
| B | Diseño de arquitectura de red y software: Topología de Gateways LoRa, Edge Computing y esquema de BD. | A | 4 días | $ 400.000 | Arquitecto de Software |
| C | Diseño esquemático (PCB): Diseño de placas para los nodos de suelo y estaciones climáticas. | A | 5 días | $ 350.000 | Ing. Electrónico |
| D | Diseño estructural CAD: Modelado 3D del chasis del dron open-source minimizando peso. | A | 6 días | $ 450.000 | Diseñador CAD / Ing. |
| E | Adquisición e importación de hardware: Compra de microcontroladores, motores, cámaras y filamento. | C, D | 10 días| $ 3.500.000| Proveedores / Presupuesto |
| F | Impresión 3D: Fabricación del chasis del dron y carcasas con protección IP67 para los nodos. | E | 7 días | $ 250.000 | Impresoras 3D, Filamento |
| G | Fabricación y soldadura de PCBs: Ensamblaje electrónico de sensores ambientales. | E | 5 días | $ 300.000 | Ing. Electrónico |
| H | Ensamblaje mecánico del dron: Integración de motores, chasis, telemetría y cámara. | F, G | 4 días | $ 400.000 | Ensamblador |
| I | Programación de firmware LoRa: Código de los microcontroladores para transmisión de datos. | G | 6 días | $ 500.000 | Desarrollador Embebido |
| J | Configuración de vuelo: Parametrización del controlador de vuelo y calibración del dron. | H | 4 días | $ 300.000 | Piloto / Ing. de Hardware |
| K | Despliegue de Servidor VPS y ERP: Configuración del VPS, seguridad local e instalación de Odoo. | B | 3 días | $ 250.000 | Administrador de Servidores |
| L | Desarrollo del Frontend Web: Construcción del portal interactivo (tipo SIATA) en Next.js. | K | 8 días | $ 800.000 | Desarrollador Frontend |
| M | Integración de Base de Datos: Separación de la data privada (fincas) y la data pública (comunal). | K | 5 días | $ 500.000 | Desarrollador Backend |
| N | Recopilación de dataset inicial: Extracción de datos climáticos y topográficos históricos de la zona. | A | 5 días | $ 200.000 | Analista de Datos |
| O | Entrenamiento de modelo de IA: Algoritmo para interpolación estadística (fincas con pocos sensores). | M, N | 7 días | $ 750.000 | Ing. de Machine Learning |
| P | Integración de IA y Web: Conexión del algoritmo predictivo con el mapa de calor del frontend. | L, O | 4 días | $ 400.000 | Desarrollador Full-Stack |
| Q | Instalación en campo (Nodos): Despliegue de Gateways LoRa y nodos en las fincas piloto. | I | 5 días | $ 600.000 | Técnicos de campo |
| R | Pruebas de vuelo autónomo: Sobrevuelo del dron sobre fincas para captura de imágenes multiespectrales. | J | 4 días | $ 350.000 | Piloto de Dron |
| S | Pruebas de estrés del sistema: Auditoría del flujo de datos (Sensores/Dron -> LoRa -> VPS -> IA). | P, Q, R| 5 días | $ 450.000 | Analista QA / Ing. |
| T | Capacitación y entrega: Formación a los campesinos sobre el uso del portal abierto y la privacidad. | S | 3 días | $ 300.000 | Líder del Proyecto |

#### 6.2 JSON de la Matriz de Transporte (Costos Base y Solución Óptima Solver):
```json
{
  "fuentes": [
    { "id": "G1", "nombre": "Gateway Norte", "oferta": 120 },
    { "id": "G2", "nombre": "Gateway Sur", "oferta": 150 },
    { "id": "G3", "nombre": "Gateway Este", "oferta": 100 },
    { "id": "G4", "nombre": "Gateway Oeste", "oferta": 80 }
  ],
  "destinos": [
    { "id": "F1", "nombre": "Finca El Cafetal", "demanda": 130 },
    { "id": "F2", "nombre": "Finca La Esperanza", "demanda": 170 },
    { "id": "F3", "nombre": "Finca Los Pinos", "demanda": 150 }
  ],
  "costos": {
    "G1": { "F1": 10, "F2": 20, "F3": 30 },
    "G2": { "F1": 40, "F2": 15, "F3": 25 },
    "G3": { "F1": 35, "F2": 45, "F3": 12 },
    "G4": { "F1": 18, "F2": 22, "F3": 14 }
  },
  "solucionSolver": {
    "G1": { "F1": 120, "F2": 0, "F3": 0 },
    "G2": { "F1": 0, "F2": 150, "F3": 0 },
    "G3": { "F1": 0, "F2": 0, "F3": 100 },
    "G4": { "F1": 10, "F2": 20, "F3": 50 }
  }
}