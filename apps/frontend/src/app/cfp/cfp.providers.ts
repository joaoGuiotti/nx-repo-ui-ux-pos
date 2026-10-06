import { Provider } from '@angular/core';
import { CfpFacade } from './application/facades/cfp.facade';
import { CfpRepository } from './domain/ports/cfp.repository';
import { CfpHttpAdapter } from './infrastructure/adapters/cfp-http.adapter';
import { CfpInMemoryAdapter } from './infrastructure/adapters/cfp-in-memory.adapter';
import { CfpSignalStore } from './application/state/cfp.signal-store';

interface CfpProvidersOptions {
  withMock: boolean;
}

/**
 * Dependency injection configuration for the CFP feature.
 *
 * @guardrail Binds the abstract CfpRepository port to its concrete adapter.
 */
export const cfpProviders = (props: CfpProvidersOptions = { withMock: false }): Provider[] => [
  CfpSignalStore,
  CfpFacade,
  {
    provide: CfpRepository,
    useClass: props.withMock ? CfpInMemoryAdapter : CfpHttpAdapter,
  },
];
