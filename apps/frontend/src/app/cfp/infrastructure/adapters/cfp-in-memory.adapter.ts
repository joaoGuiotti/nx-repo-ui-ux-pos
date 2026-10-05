import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CfpRepository } from '../../domain/ports/cfp.repository';
import { Speaker } from '../../domain/entities/speaker.entity';

/**
 * In-memory adapter implementing CfpRepository port.
 * Ideal for offline development and isolated integration tests.
 */
@Injectable()
export class CfpInMemoryAdapter implements CfpRepository {
  private speakers: Speaker[] = [];

  submitProposal(speaker: Speaker): Observable<Speaker> {
    const saved: Speaker = {
      ...speaker,
      id:
        speaker.id ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `speaker-${Date.now()}`),
    };
    this.speakers.push(saved);
    return of(saved);
  }
}
