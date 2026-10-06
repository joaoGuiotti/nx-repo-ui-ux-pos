import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CfpRepository } from '../../domain/ports/cfp.repository';
import { Speaker } from '../../domain/entities/speaker.entity';
import { CfpMapper } from '../http/cfp.mapper';
import { SpeakerApiDTO } from '../http/cfp.dtos';
import { environment } from '../../../../environments/environment';

export class CfpDomainError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'CfpDomainError';
  }
}

/**
 * Concrete HTTP adapter implementing CfpRepository port.
 *
 * @guardrail Uses CfpMapper to return Domain Entity, never raw DTOs.
 * Handles HTTP errors and converts them to typed domain errors.
 */
@Injectable()
export class CfpHttpAdapter implements CfpRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || '/api/cfp';

  submitProposal(speaker: Speaker): Observable<Speaker> {
    const dto = CfpMapper.toDTO(speaker);
    return this.http.post<SpeakerApiDTO>(this.apiUrl, dto).pipe(
      map((res) => CfpMapper.toDomain(res)),
      catchError((error: unknown) => {
        let message = 'Falha na comunicação com o servidor de CFP.';
        let statusCode: number | undefined;

        if (error instanceof HttpErrorResponse) {
          statusCode = error.status;
          message = error.error?.message || error.message || message;
        }

        return throwError(() => new CfpDomainError(message, statusCode));
      })
    );
  }
}
