// ============================================================
//  MODELOS - adaptados a la API real (iot-trabajo.onrender.com)
// ============================================================

// Lo que devuelve GET /mediciones/ultima  y  GET /mediciones
export interface Medicion {
  id_medicion: number;
  nivel_agua: number;       // nivel de la quebrada en cm (el que sube/baja)
  nivel_fluvial: number;    // valor secundario (uso por confirmar)
  temperatura: number;      // °C
  humedad: number;          // %
  esta_lloviendo: boolean;  // true/false
  estado_alerta: string;    // "0" no alerta, "1" suena 1 vez, "2" suena 2 veces
  fecha_hora: string;       // "2026-06-27 03:12:37.572089"
}

// Lo que devuelve GET /alertas (lista)
export interface Alerta {
  id_alerta: number;
  nivel_alerta: string;     // "AMARILLA" | "NARANJA" | "ROJA" | "CRITICA" | "PRUEBA"
  descripcion: string;
  fecha_hora: string;
  atendida: boolean;
}

// Color e info visual para cada nivel de alerta de la API
export const ALERTA_INFO: Record<string, { texto: string; color: string }> = {
  NORMAL:   { texto: 'Normal',         color: '#1D9E75' }, // sin alertas
  AMARILLA: { texto: 'Precaución',     color: '#EAB308' },
  NARANJA:  { texto: 'Prevención',     color: '#EF9F27' },
  ROJA:     { texto: 'Crítico',        color: '#E24B4A' },
  CRITICA:  { texto: 'Crítico',        color: '#B91C1C' },
  PRUEBA:   { texto: 'Prueba',         color: '#6B7280' },
};

// Devuelve la info visual (texto + color) a partir del nombre del nivel
export function infoDeAlerta(nivel: string | null | undefined) {
  if (!nivel) return ALERTA_INFO['NORMAL'];
  return ALERTA_INFO[nivel] ?? ALERTA_INFO['NORMAL'];
}

// Escala del tanque. La quebrada se mueve en pocos cm, así que el "lleno"
// visual lo ponemos en 35 cm (ajústalo si tu quebrada llega más alto).
export const NIVEL_MAX_TANQUE = 35;
