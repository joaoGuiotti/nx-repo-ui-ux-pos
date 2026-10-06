import { Route } from '@angular/router';
import { provideCfp } from './cfp.providers';

/**
 * Feature routes for CFP (Call for Papers).
 *
 * Configures scoped feature providers and lazy-loads the Container (Smart) component.
 */
export const cfpRoutes: Route[] = [
  {
    path: '',
    providers: provideCfp(),
    loadComponent: () =>
      import(
        './presentation/containers/cfp-form-page/cfp-form-page.component'
      ).then((m) => m.CfpFormPageComponent),
  },
];
