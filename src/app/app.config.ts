import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Para hacer peticiones HTTP a la API REST
import { provideHttpClient } from '@angular/common/http';

// Chart.js / ng2-charts
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Permite usar HttpClient para consumir la API (iot-trabajo.onrender.com)
    provideHttpClient(),

    // Gráficas
    provideCharts(withDefaultRegisterables()),
  ],
};
