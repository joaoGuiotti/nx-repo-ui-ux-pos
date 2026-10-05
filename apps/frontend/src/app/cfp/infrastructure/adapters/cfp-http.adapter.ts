import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CfpRepository } from '../../domain/ports/cfp.repository';
import { Speaker } from '../../domain/entities/speaker.entity';
import { CfpMapper } from '../http/cfp.mapper';
import { SpeakerApiDTO } from '../http/cfp.dtos';

/**
 * Concrete HTTP adapter implementing CfpRepository port.
 *
 * @guardrail Uses CfpMapper to return Domain Entity, never raw DTOs.
 */
@Injectable()
export class CfpHttpAdapter implements CfpRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/cfp';

  submitProposal(speaker: Speaker): Observable<Speaker> {
    const dto = CfpMapper.toDTO(speaker);
    return this.http
      .post<SpeakerApiDTO>(this.apiUrl, dto)
      .pipe(map((res) => CfpMapper.toDomain(res)));
  }
}
