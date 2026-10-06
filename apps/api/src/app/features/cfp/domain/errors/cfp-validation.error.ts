import { DomainError } from '../../../../shared/errors/domain.error';

export class CfpValidationError extends DomainError {
  readonly kind = 'VALIDATION_ERROR';
  readonly code = 'CFP_INVALID_PAYLOAD';

  constructor(message: string) {
    super(message);
  }
}
