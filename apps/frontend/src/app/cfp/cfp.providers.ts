import { Provider } from '@angular/core';
import { CfpFacade } from './application/facades/cfp.facade';
import { CfpRepository } from './domain/ports/cfp.repository';
import { CfpHttpAdapter } from './infrastructure/adapters/cfp-http.adapter';
import { CfpInMemoryAdapter } from './infrastructure/adapters/cfp-in-memory.adapter';
import { CfpSignalStore } from './application/state/cfp.signal-store';
import { environment } from '../../environments/environment';

export interface CfpProvidersOptions {
  useInMemory?: boolean;
}

/**
 * Dependency injection configuration for the CFP feature.
 *
 * @guardrail Binds the abstract CfpRepository port to its concrete adapter.
 */
export const provideCfp = (options?: CfpProvidersOptions): Provider[] => {
  const useInMemory = options?.useInMemory ?? environment.useInMemory;
  return [
    CfpSignalStore,
    CfpFacade,
    {
      provide: CfpRepository,
      useClass: useInMemory ? CfpInMemoryAdapter : CfpHttpAdapter,
    },
  ];
};

/** Alias for backward compatibility */
export const cfpProviders = (options?: { withMock?: boolean }): Provider[] =>
  provideCfp({ useInMemory: options?.withMock });
