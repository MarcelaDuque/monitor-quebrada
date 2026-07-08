import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { Medicion, Alerta } from '../models/lectura.model';

/**
 * SERVICIO REAL - consume la API REST de tus compañeros (FastAPI en Render).
 *
 * IMPORTANTE - PROXY DE DESARROLLO:
 * La BASE ahora es '/api' (ruta local), NO la URL completa de Render.
 * El archivo proxy.conf.json reenvía /api -> https://iot-trabajo.onrender.com
 * por detrás, esquivando el bloqueo de CORS mientras desarrollas.
 *
 * Cuando tus compañeros arreglen el CORS en la API, puedes volver a poner
 * la URL completa aquí y arrancar con "ng serve" normal (sin proxy).
 */
@Injectable({ providedIn: 'root' })
export class QuebradaApiService {
  private http = inject(HttpClient);

  // Usamos la URL completa de la api.
  private readonly BASE = 'https://iot-trabajo.onrender.com';

  // Cada cuántos milisegundos volver a consultar la API
  private readonly INTERVALO = 5000; // 5 segundos

  /** Última medición, refrescada cada INTERVALO ms */
  lecturaActual(): Observable<Medicion> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Medicion>(`${this.BASE}/mediciones/ultima`)),
      shareReplay(1),
    );
  }

  /**
   * Histórico para la gráfica: pide todas las mediciones y se queda con
   * las últimas 30, ordenadas de más antigua a más reciente.
   */
  historico(): Observable<Medicion[]> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Medicion[]>(`${this.BASE}/mediciones`)),
      map((arr) => {
        const ordenado = [...arr].sort(
          (a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime(),
        );
        return ordenado.slice(-30);
      }),
      shareReplay(1),
    );
  }

  /**
   * Lista de alertas. La API las devuelve de más reciente a más antigua;
   * la primera del arreglo es la más nueva.
   */
  alertas(): Observable<Alerta[]> {
    return timer(0, this.INTERVALO).pipe(
      switchMap(() => this.http.get<Alerta[]>(`${this.BASE}/alertas`)),
      shareReplay(1),
    );
  }
}
