# 🌊 Sistema de Alerta Temprana para Crecientes Súbitas

### Dashboard Web · Monitoreo en tiempo real del nivel de agua de una quebrada

![Angular](https://img.shields.io/badge/Angular-22.0.1-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)

Interfaz visual del Sistema de Alerta Temprana para Crecientes Súbitas. Consume los datos recolectados por un dispositivo ESP32 con sensores (almacenados a través de una API REST) y los presenta en tiempo real mediante tarjetas de métricas, un indicador visual de nivel, gráficas históricas y una tabla de mediciones. El dashboard refleja el estado de alerta del sistema mediante un código de colores.

---

## 📑 Tabla de contenido

- [Objetivos](#-objetivos-del-dashboard)
- [Arquitectura general](#-arquitectura-general-del-sistema)
- [Tecnologías](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Modelos de datos](#-modelos-de-datos)
- [Consumo de la API](#-consumo-de-la-api-rest)
- [Componentes de la interfaz](#-componentes-de-la-interfaz)
- [Conexión con la API y solución del CORS](#-conexión-con-la-api-y-solución-del-cors)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Conclusiones](#-conclusiones)

---

## 🎯 Objetivos del dashboard

- Mostrar en tiempo real el nivel de agua, la temperatura, la humedad y la condición de lluvia de la quebrada.
- Representar visualmente el nivel del agua mediante un indicador tipo tanque que cambia de color según el estado de alerta.
- Graficar el histórico de mediciones para observar tendencias a lo largo del tiempo.
- Presentar una tabla con el historial detallado de las mediciones registradas.
- Consumir los datos desde una API REST desarrollada por el equipo, manteniendo la información siempre actualizada.

---

## 🏗️ Arquitectura general del sistema

El sistema completo se compone de cuatro capas que trabajan de manera coordinada. El dashboard corresponde a la **capa de visualización**, ubicada al final del flujo de datos.

### Flujo de datos

1. El dispositivo **ESP32-S3** lee los sensores (nivel de agua, temperatura, humedad y lluvia) y envía los datos mediante peticiones HTTP POST a la API.
2. La **API REST** (FastAPI) recibe los datos, evalúa el nivel de riesgo según los umbrales, genera alertas cuando corresponde y almacena todo en la base de datos.
3. La base de datos **PostgreSQL** guarda de forma persistente las mediciones, las alertas y la configuración.
4. El **dashboard web** (esta capa) consulta periódicamente la API mediante peticiones HTTP GET y presenta la información al usuario.

### Componentes del sistema

| Componente | Tecnología | Función |
|---|---|---|
| Dispositivo | ESP32-S3 + sensores | Lee los sensores y envía los datos a la API. |
| API REST | Python + FastAPI | Procesa, almacena y gestiona la lógica de alertas. |
| Base de datos | PostgreSQL | Almacena mediciones, alertas y configuración. |
| Despliegue | Render (nube) | Publica la API en internet para acceso remoto. |
| **Dashboard** | **Angular 22** | **Visualiza los datos y las alertas en tiempo real.** |

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso en el proyecto |
|---|---|---|
| Angular | 22.0.1 | Framework principal para construir la interfaz. |
| TypeScript | 5.x | Lenguaje de programación del proyecto. |
| Chart.js + ng2-charts | 4.x | Renderizado de la gráfica histórica. |
| HttpClient | Angular | Cliente para consumir la API REST por HTTP. |
| RxJS | 7.8 | Manejo de flujos de datos y actualización periódica. |
| Node.js | 24.16 | Entorno de ejecución para las herramientas. |

> **¿Por qué Angular?** Es un framework robusto y estructurado, ideal para aplicaciones con datos en tiempo real. Su sistema de componentes permite dividir la interfaz en piezas reutilizables, y su manejo reactivo mediante *signals* hace que la vista se actualice automáticamente cada vez que llegan nuevos datos de la API, sin recargar la página.

---

## 📁 Estructura del proyecto

```
monitor-quebrada/
├── proxy.conf.json          # Configuración del proxy de desarrollo
├── package.json
├── angular.json
└── src/
    └── app/
        ├── app.ts            # Componente principal / dashboard
        ├── app.html          # Estructura visual del dashboard
        ├── app.css           # Estilos del dashboard
        ├── app.config.ts     # Configuración: HttpClient y gráficas
        ├── models/
        │   └── lectura.model.ts      # Modelos de datos
        ├── services/
        │   └── quebrada-api.service.ts   # Consumo de la API
        └── components/
            ├── tanque/       # Indicador visual de nivel
            ├── grafica/      # Gráfica histórica
            └── historial/    # Tabla de mediciones
```

---

## 📊 Modelos de datos

Los modelos definen la estructura de los datos que devuelve la API. Se crearon dos interfaces principales en `lectura.model.ts`.

### Interfaz `Medicion`

Representa una lectura individual de los sensores.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_medicion` | number | Identificador único de la medición. |
| `nivel_agua` | number | Nivel de la quebrada en centímetros. |
| `nivel_fluvial` | number | Valor secundario del sensor fluvial. |
| `temperatura` | number | Temperatura en grados Celsius. |
| `humedad` | number | Humedad relativa en porcentaje. |
| `esta_lloviendo` | boolean | Indica si está lloviendo. |
| `estado_alerta` | string | Nivel de la alarma sonora (0, 1 o 2). |
| `fecha_hora` | string | Fecha y hora de la medición. |

### Interfaz `Alerta`

Representa una alerta generada automáticamente por la API.

| Campo | Tipo | Descripción |
|---|---|---|
| `id_alerta` | number | Identificador único de la alerta. |
| `nivel_alerta` | string | Nivel: AMARILLA, NARANJA, ROJA o CRITICA. |
| `descripcion` | string | Texto descriptivo de la alerta. |
| `fecha_hora` | string | Fecha y hora de la alerta. |
| `atendida` | boolean | Indica si la alerta ya fue atendida. |

### Código de colores de las alertas

El dashboard traduce el nivel de alerta que devuelve la API a un color, aplicado al indicador de nivel y a la etiqueta de estado. Así, el color siempre coincide con la lógica de la API.

| Nivel de alerta | Estado mostrado | Color |
|---|---|---|
| *(sin alertas)* | Normal | 🟢 Verde |
| AMARILLA | Precaución | 🟡 Amarillo |
| NARANJA | Prevención | 🟠 Naranja |
| ROJA | Crítico | 🔴 Rojo |
| CRITICA | Crítico | 🔴 Rojo oscuro |

---

## 🔌 Consumo de la API REST

La comunicación con la API se centraliza en el servicio `quebrada-api.service.ts`, que utiliza el cliente `HttpClient` de Angular. Como una API REST no envía datos por sí sola, el dashboard emplea la técnica de **polling**: consulta la API automáticamente cada 5 segundos para mantener la información actualizada.

### Endpoints consumidos

| Método | Endpoint | Uso en el dashboard |
|---|---|---|
| `GET` | `/mediciones/ultima` | Última medición (tarjetas y tanque). |
| `GET` | `/mediciones` | Todas las mediciones (gráfica y tabla). |
| `GET` | `/alertas` | Alertas (color y estado del sistema). |

### Métodos del servicio

- **`lecturaActual()`** — consulta `GET /mediciones/ultima` y entrega la medición más reciente.
- **`historico()`** — consulta `GET /mediciones`, ordena los registros por fecha y entrega las últimas 30 mediciones.
- **`alertas()`** — consulta `GET /alertas` y entrega la lista de alertas generadas por la API.

---

## 🧩 Componentes de la interfaz

El dashboard se divide en un componente principal y tres componentes secundarios, lo que facilita el mantenimiento y la reutilización.

- **Componente principal (App):** contenedor del dashboard. Inyecta el servicio de la API, recibe los tres flujos de datos y los convierte en señales reactivas. Calcula el color del estado, la hora de la última lectura y la tendencia, y distribuye la información hacia los componentes hijos.
- **Componente Tanque:** indicador visual que se llena según el nivel de agua. El color lo recibe del componente principal (obtenido de la última alerta de la API), pasando de verde a amarillo, naranja o rojo.
- **Componente Gráfica:** usa Chart.js para dibujar una gráfica de líneas con dos series (nivel de agua en cm y temperatura en °C) con ejes independientes.
- **Componente Historial:** tabla con el detalle de las mediciones (id, nivel, temperatura, humedad, lluvia, fecha), ordenadas de la más reciente a la más antigua, con encabezado fijo.

---

## 🌐 Conexión con la API y solución del CORS

Durante la integración surgió una restricción de seguridad de los navegadores conocida como **CORS** (Cross-Origin Resource Sharing). El navegador bloqueaba las peticiones porque el dashboard (en `localhost`) intentaba acceder a la API en otro dominio, y la API no incluía los encabezados de permiso.

### Solución definitiva (lado de la API)

Habilitar CORS en FastAPI agregando el middleware que autoriza el acceso desde otros orígenes:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Solución temporal (proxy de desarrollo)

Mientras se habilita el CORS en la API, se configuró un **proxy de desarrollo** en Angular que redirige las peticiones locales hacia la API por detrás del servidor de desarrollo, evitando el bloqueo del navegador. Aplica únicamente durante el desarrollo local. La configuración está en `proxy.conf.json` y se activa con la opción `--proxy-config` al ejecutar el proyecto.

---

## 🚀 Instalación y ejecución

### Requisitos previos

- **Node.js** versión 20.19 o superior.
- **Angular CLI** instalado de forma global (`npm install -g @angular/cli`).

### Pasos

**1.** Clonar el repositorio:

```bash
git clone https://github.com/MarcelaDuque/monitor-quebrada
cd monitor-quebrada
```

**2.** Instalar las dependencias (recrea `node_modules`, que no se sube al repositorio):

```bash
npm install
```

**3.** Ejecutar el dashboard incluyendo la configuración del proxy de desarrollo:

```bash
ng serve --proxy-config proxy.conf.json
```

**4.** Abrir el navegador en:

```
http://localhost:4200
```

Una vez cargado, el dashboard consulta la API automáticamente y actualiza la información cada 5 segundos.

> ⚠️ **Nota sobre Render:** la API está desplegada en el plan gratuito de Render, que se "duerme" tras un periodo de inactividad. La primera petición puede tardar entre 30 y 50 segundos en responder (los datos aparecerán en 0 ese instante). Es normal; al despertar la API, la información se actualiza sola.

---

## ✅ Conclusiones

El dashboard cumple con el objetivo de visualizar en tiempo real la información del Sistema de Alerta Temprana para Crecientes Súbitas. A través de la conexión con la API REST, presenta de manera clara el nivel de agua, la temperatura, la humedad y la condición de lluvia de la quebrada, e integra un sistema de colores que refleja el estado de alerta calculado por la API.

El desarrollo permitió aplicar conceptos de programación frontend con Angular, consumo de servicios web mediante peticiones HTTP, manejo de datos reactivos y resolución de problemas reales de integración como la restricción de CORS. El resultado es una interfaz funcional, organizada en componentes reutilizables, que se mantiene sincronizada con los datos reales del sistema y sienta las bases para futuras mejoras.

---

<div align="center">


</div>
