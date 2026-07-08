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

// ============================================================
//  UMBRALES DE NIVEL DE AGUA (según la lógica del firmware)
//  El color se decide directamente por el nivel_agua en cm.
// ------------------------------------------------------------
//    Normal       -> menos de 20 cm   -> verde
//    Advertencia  -> 20 cm o más      -> amarillo
//    Crítico      -> 40 cm o más      -> naranja
//    Evacuación   -> 60 cm o más      -> rojo
// ============================================================
export const UMBRALES = {
  ADVERTENCIA: 20,
  CRITICO: 40,
  EVACUACION: 60,
};

// Info visual (texto + color) para cada estado
export interface EstadoInfo {
  texto: string;
  color: string;
}

// Decide el estado y el color a partir del nivel de agua (en cm)
export function infoDeNivel(nivel: number): EstadoInfo {
  if (nivel >= UMBRALES.EVACUACION) {
    return { texto: 'Evacuación', color: '#E24B4A' }; // rojo
  }
  if (nivel >= UMBRALES.CRITICO) {
    return { texto: 'Crítico', color: '#EF7A27' };    // naranja
  }
  if (nivel >= UMBRALES.ADVERTENCIA) {
    return { texto: 'Advertencia', color: '#EAB308' }; // amarillo
  }
  return { texto: 'Normal', color: '#1D9E75' };        // verde
}

// Escala del tanque. La quebrada se mueve en pocos cm; el "lleno" visual
// lo ponemos en 70 cm para que se vea bien el umbral de evacuación (60).
export const NIVEL_MAX_TANQUE = 70;
