import { Component, input, computed } from '@angular/core';
import { NIVEL_MAX_TANQUE, UMBRALES } from '../../models/lectura.model';

/**
 * Indicador visual tipo "tanque" que se llena según el nivel de agua.
 * El COLOR lo recibe desde el dashboard (calculado por el nivel en cm).
 * Muestra líneas de referencia en los umbrales de advertencia, crítico
 * y evacuación.
 */
@Component({
  selector: 'app-tanque',
  standalone: true,
  templateUrl: './tanque.component.html',
  styleUrl: './tanque.component.css',
})
export class TanqueComponent {
  // Nivel actual en cm
  nivel = input.required<number>();
  // Color que viene del dashboard (hex)
  color = input.required<string>();

  // Altura del relleno en porcentaje (0 a 100), según la escala del tanque
  alturaPct = computed(() =>
    Math.max(0, Math.min(100, (this.nivel() / NIVEL_MAX_TANQUE) * 100))
  );

  max = NIVEL_MAX_TANQUE;

  // Posición (en % desde abajo) de cada línea de umbral
  lineaAdvertencia = (UMBRALES.ADVERTENCIA / NIVEL_MAX_TANQUE) * 100;
  lineaCritico = (UMBRALES.CRITICO / NIVEL_MAX_TANQUE) * 100;
  lineaEvacuacion = (UMBRALES.EVACUACION / NIVEL_MAX_TANQUE) * 100;

  umbrales = UMBRALES;
}
