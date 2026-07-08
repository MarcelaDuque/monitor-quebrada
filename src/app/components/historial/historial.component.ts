import { Component, input, computed } from '@angular/core';
import { Medicion } from '../../models/lectura.model';

/**
 * Tabla de historial de mediciones.
 * Muestra TODOS los registros, ordenados por id_medicion de mayor a menor
 * (el más reciente arriba: 102, 101, 100...).
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

  // Ordena por id_medicion de MAYOR a MENOR (descendente)
  filas = computed(() =>
    [...this.mediciones()].sort((a, b) => b.id_medicion - a.id_medicion)
  );

  // Formatea la fecha para que se vea bonita
  formatearFecha(fecha: string): string {
    const d = new Date(fecha.replace(' ', 'T'));
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleString('es-CO', { hour12: false });
  }
}
