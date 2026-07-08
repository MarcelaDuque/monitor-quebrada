import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { Medicion, Alerta } from '../models/lectura.model';

/**
 * SERVICIO REAL - consume la API REST de tus compañeros (FastAPI en Render).
 *
 * Endpoints usados:
 *   GET /mediciones/ultima  -> última medición
 *   GET /mediciones         -> todas las mediciones (para la gráfica y la tabla)
 *   GET /alertas            -> lista de alertas
 *
 * Como una API REST normal NO empuja datos sola, hacemos "polling":
 * consultamos la API cada X segundos.
 */
@Injectable({ providedIn: 'root' })
export class QuebradaApiService {
  private http = inject(HttpClient);

  // URL base de la API. Si cambia el dominio, solo se edita aquí.
  private readonly BASE = 'https://iot-trabajo.onrender.com';

  // Cada cuántos milisegundos volver a consultar la API
  private readonly INTERVALO = 5000; // 5 segundos

  // Cuántos registros usar SOLO en la gráfica (para que no se sature).
  // La tabla muestra TODOS; este límite es únicamente para la gráfica.
  private readonly MAX_GRAFICA = 100;

  /** Última medición, refrescada cada INTERVALO ms */
  lecturaActual(): Observable<Medicion> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Medicion>(`${this.BASE}/mediciones/ultima`)),
      shareReplay(1),
    );
  }

  /**
   * TODAS las mediciones, ordenadas por fecha de más antigua a más reciente.
   * Se usa tanto para la tabla como para la gráfica (cada una las ordena/recorta
   * a su manera después).
   */
  historico(): Observable<Medicion[]> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Medicion[]>(`${this.BASE}/mediciones`)),
      map((arr) => {
        return [...arr].sort(
          (a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime(),
        );
      }),
      shareReplay(1),
    );
  }

  /** Lista de alertas (la más reciente primero). */
  alertas(): Observable<Alerta[]> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Alerta[]>(`${this.BASE}/alertas`)),
      shareReplay(1),
    );
  }
}
