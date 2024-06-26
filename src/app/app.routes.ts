import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'pilotos',
    title: 'Pilotos',
    loadComponent: () =>
      import('./components/list-competitors/list-competitors.component'),
  },
  {
    path: 'registro',
    title: 'Registrar competidor',
    loadComponent: () =>
      import(
        './components/register-competitor/register-competitor.component'
      ).then((m) => m.RegisterCompetitorComponent),
  },

  {
    path: ':id',
    loadComponent: () => import('./pages/competitors/competitors.component'),
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
