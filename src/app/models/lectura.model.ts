// ============================================================
//  MODELOS - adaptados a la API real (iot-trabajo.onrender.com)
// ============================================================

// Lo que devuelve GET /mediciones/ultima  y  GET /mediciones
export interface Medicion {
  id_medicion: number;
  nivel_agua: number;       // nivel de la quebrada en cm
  nivel_fluvial: number;    // valor secundario
  temperatura: number;      // °C
  humedad: number;          // %
  esta_lloviendo: boolean;  // true/false
  estado_alerta: string;    // NORMAL | PREVENCIÓN | PRECAUCIÓN | CRÍTICA (viene de la API)
  fecha_hora: string;       // "2026-06-27 03:12:37.572089"
}

// Lo que devuelve GET /alertas (lista)
export interface Alerta {
  id_alerta: number;
  nivel_alerta: string;
  descripcion: string;
  fecha_hora: string;
  atendida: boolean;
}

// ============================================================
//  MAPEO DE COLOR SEGÚN EL estado_alerta QUE ENVÍA LA API
//  El dashboard NO calcula nada: solo traduce el texto del
//  estado (que ya viene calculado por la API) a un color.
// ------------------------------------------------------------
//    NORMAL      -> verde
//    PREVENCIÓN  -> amarillo
//    PRECAUCIÓN  -> naranja
//    CRÍTICA     -> rojo
// ============================================================
export interface EstadoInfo {
  texto: string;
  color: string;
}

// Normaliza el texto (mayúsculas, sin tildes) para comparar sin errores
function normalizar(s: string): string {
  return (s || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .trim();
}

// Traduce el estado_alerta de la API a texto + color (sin calcular umbrales)
export function infoDeEstado(estado: string): EstadoInfo {
  switch (normalizar(estado)) {
    case 'NORMAL':
      return { texto: 'Normal', color: '#1D9E75' };      // verde
    case 'PREVENCION':
      return { texto: 'Prevención', color: '#EAB308' };  // amarillo
    case 'PRECAUCION':
      return { texto: 'Precaución', color: '#EF7A27' };  // naranja
    case 'CRITICA':
    case 'CRITICO':
      return { texto: 'Crítica', color: '#E24B4A' };     // rojo
    default:
      // Si llega un estado desconocido, lo mostramos en gris neutro
      return { texto: estado || 'Sin dato', color: '#9CA3AF' };
  }
}

// Escala del tanque (solo visual, para llenar la barra). No afecta el color.
export const NIVEL_MAX_TANQUE = 200;
