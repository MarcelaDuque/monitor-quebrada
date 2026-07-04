import { Component, input, computed } from '@angular/core';
import { NIVEL_MAX_TANQUE } from '../../models/lectura.model';

/**
 * Indicador visual tipo "tanque" que se llena según el nivel de agua.
 * El COLOR ya no se calcula aquí: lo recibe desde el dashboard, que lo
 * obtiene de la API (nivel_alerta de la última alerta).
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
  // Color que viene de la API (hex)
  color = input.required<string>();

  // Altura del relleno en porcentaje (0 a 100), según la escala del tanque
  alturaPct = computed(() =>
    Math.max(0, Math.min(100, (this.nivel() / NIVEL_MAX_TANQUE) * 100))
  );

  max = NIVEL_MAX_TANQUE;
}
