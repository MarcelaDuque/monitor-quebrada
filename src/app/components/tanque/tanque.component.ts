import { Component, input, computed } from '@angular/core';
import { NIVEL_MAX_TANQUE } from '../../models/lectura.model';

/**
 * Indicador visual tipo "tanque" que se llena según el nivel de agua.
 * El COLOR lo recibe desde el dashboard, que lo obtiene del estado_alerta
 * de la API. El tanque NO calcula estados.
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
  // Color que viene del dashboard (según estado_alerta de la API)
  color = input.required<string>();
  // Texto del estado (Normal, Prevención, Precaución, Crítica)
  estado = input.required<string>();

  // Altura del relleno en porcentaje (0 a 100), solo visual
  alturaPct = computed(() =>
    Math.max(0, Math.min(100, (this.nivel() / NIVEL_MAX_TANQUE) * 100))
  );
}
