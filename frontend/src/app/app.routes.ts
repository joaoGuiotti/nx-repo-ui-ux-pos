import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'cfp',
    loadChildren: () =>
      import('./cfp/cfp.routes').then((m) => m.cfpRoutes),
  },
];

