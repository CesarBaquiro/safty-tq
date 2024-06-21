import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pilotos',
    loadComponent: () =>
      import('./components/list-competitors/list-competitors.component'),
  },
  {
    path: '1',
    loadComponent: () => import('./pages/competitors/competitors.component'),
  },
  {
    path: '',
    title: 'Home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'registrar',
    title: 'Registrar competidor',
    loadComponent: () =>
      import(
        './components/register-competitor/register-competitor.component'
      ).then((m) => m.RegisterCompetitorComponent),
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
