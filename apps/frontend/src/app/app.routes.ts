import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cfp',
  },
  {
    path: 'cfp',
    loadChildren: () =>
      import('./cfp/cfp.routes').then((m) => m.cfpRoutes),
  },
];

