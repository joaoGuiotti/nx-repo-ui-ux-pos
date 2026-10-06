import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { CfpValidationError } from '../../../features/cfp/domain/errors/cfp-validation.error';
import { DomainErrorFilter } from '../../../shared/filters/domain-error.filter';

describe('DomainErrorFilter', () => {
  let filter: DomainErrorFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new DomainErrorFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should catch CfpValidationError and format response with 422 Unprocessable Entity', () => {
    const error = new CfpValidationError('Validation failed');

    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'VALIDATION_ERROR',
      code: 'CFP_INVALID_PAYLOAD',
      message: 'Validation failed',
    });
  });
});
