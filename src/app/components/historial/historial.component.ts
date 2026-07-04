import { Component, input, computed } from '@angular/core';
import { Medicion } from '../../models/lectura.model';

/**
 * Tabla de historial de mediciones.
 * Usa el mismo GET /mediciones (a través del servicio), mostrando las
 * lecturas en filas, de la más reciente a la más antigua.
 */
@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent {
  // Recibe la lista de mediciones desde el dashboard
  mediciones = input.required<Medicion[]>();

  // Las invertimos para mostrar la más reciente arriba
  filas = computed(() => [...this.mediciones()].reverse());

  // Formatea la fecha para que se vea bonita
  formatearFecha(fecha: string): string {
    const d = new Date(fecha.replace(' ', 'T'));
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleString('es-CO', { hour12: false });
  }
}
