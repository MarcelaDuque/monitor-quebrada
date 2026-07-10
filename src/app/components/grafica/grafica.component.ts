import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Medicion } from '../../models/lectura.model';

/**
 * Gráfica histórica con dos líneas: nivel de agua (cm) y temperatura (°C).
 * Muestra los últimos 100 registros para no saturarse.
 */
@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="grafica-box">
      <div class="leyenda-grafica">
        <span><span class="cuadro" style="background:#378ADD"></span> Nivel de agua (cm)</span>
        <span><span class="linea-dash"></span> Temperatura (°C)</span>
      </div>
      <div class="canvas-wrap">
        <canvas baseChart
          [data]="chartData()"
          [options]="options"
          type="line">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .grafica-box { width: 100%; }
    .leyenda-grafica {
      display: flex; gap: 20px; font-size: 13px; color: #666; margin-bottom: 12px;
    }
    .leyenda-grafica span { display: flex; align-items: center; gap: 6px; }
    .cuadro { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }
    .linea-dash {
      width: 16px; height: 0; border-top: 2px dashed #D85A30; display: inline-block;
    }
    .canvas-wrap { position: relative; width: 100%; height: 280px; }
  `],
})
export class GraficaComponent {
  mediciones = input.required<Medicion[]>();

  // Solo los últimos 100 (de más antiguo a más reciente)
  private ultimas = computed(() => this.mediciones().slice(-100));

  chartData = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.ultimas().map((m) => {
      const d = new Date(m.fecha_hora.replace(' ', 'T'));
      return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('es-CO', { hour12: false });
    }),
    datasets: [
      {
        label: 'Nivel de agua (cm)',
        yAxisID: 'y',
        data: this.ultimas().map((m) => m.nivel_agua),
        borderColor: '#378ADD',
        backgroundColor: 'rgba(55,138,221,0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
      },
      {
        label: 'Temperatura (°C)',
        yAxisID: 'y1',
        data: this.ultimas().map((m) => m.temperatura),
        borderColor: '#D85A30',
        borderWidth: 2,
        borderDash: [5, 4],
        fill: false,
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  }));

  options: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        position: 'left',
        beginAtZero: true,
        title: { display: true, text: 'cm' },
      },
      y1: {
        position: 'right',
        // Rango fijo y razonable para temperatura (evita la escala rara)
        min: 0,
        max: 50,
        title: { display: true, text: '°C' },
        grid: { drawOnChartArea: false },
      },
    },
  };
}
