import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TanqueComponent } from './components/tanque/tanque.component';
import { GraficaComponent } from './components/grafica/grafica.component';
import { HistorialComponent } from './components/historial/historial.component';
import {
  Medicion,
  Alerta,
  infoDeNivel,
} from './models/lectura.model';
import { QuebradaApiService } from './services/quebrada-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TanqueComponent, GraficaComponent, HistorialComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private svc = inject(QuebradaApiService);

  // Datos de la API (se refrescan solos cada 5 seg). Valores iniciales por si
  // la API tarda en responder la primera vez.
  actual = toSignal(this.svc.lecturaActual(), {
    initialValue: {
      id_medicion: 0,
      nivel_agua: 0,
      nivel_fluvial: 0,
      temperatura: 0,
      humedad: 0,
      esta_lloviendo: false,
      estado_alerta: '0',
      fecha_hora: new Date().toISOString(),
    } as Medicion,
  });

  historico = toSignal(this.svc.historico(), { initialValue: [] as Medicion[] });
  alertas = toSignal(this.svc.alertas(), { initialValue: [] as Alerta[] });

  // La alerta más reciente (para mostrar su descripción junto al tanque).
  ultimaAlerta = computed<Alerta | null>(() => {
    const lista = this.alertas();
    return lista.length > 0 ? lista[0] : null;
  });

  // Info visual (texto + color) calculada DIRECTAMENTE del nivel de agua
  // según los umbrales del firmware (20 / 40 / 60 cm).
  estadoInfo = computed(() => infoDeNivel(this.actual().nivel_agua));

  // Color para el tanque y la píldora
  color = computed(() => this.estadoInfo().color);

  // Hora formateada de la última medición
  horaActual = computed(() => {
    const f = this.actual().fecha_hora;
    const d = new Date(f.replace(' ', 'T'));
    return isNaN(d.getTime())
      ? '--:--:--'
      : d.toLocaleTimeString('es-CO', { hour12: false });
  });

  // Flecha de tendencia comparando las dos últimas mediciones
  tendencia = computed(() => {
    const h = this.historico();
    if (h.length < 2) return '=';
    const dif = h[h.length - 1].nivel_agua - h[h.length - 2].nivel_agua;
    return dif > 0.2 ? '▲' : dif < -0.2 ? '▼' : '=';
  });

  // Texto de "está lloviendo"
  textoLluvia = computed(() => (this.actual().esta_lloviendo ? 'Sí' : 'No'));
}
