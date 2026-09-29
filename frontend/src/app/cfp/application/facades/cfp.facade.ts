import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CfpRepository } from '../../domain/ports/cfp.repository';
import { Speaker } from '../../domain/entities/speaker.entity';
import { CfpField } from '../../domain/entities/cfp-form.types';
import { CfpSignalStore } from '../../infrastructure/state/cfp.signal-store';

/**
 * Facade coordinating CFP state and repository operations.
 *
 * @guardrail Injects the abstract CfpRepository port (Inversion of Control), never concrete adapters.
 * Acts as the single point of contact for UI Containers.
 */
@Injectable()
export class CfpFacade {
  private readonly repository = inject(CfpRepository);
  private readonly store = inject(CfpSignalStore);

  /* ── Signals exposed to UI ── */
  readonly id = this.store.id;
  readonly nome = this.store.nome;
  readonly email = this.store.email;
  readonly talkTitle = this.store.talkTitle;
  readonly isGDE = this.store.isGDE;
  readonly isSubmitting = this.store.isSubmitting;
  readonly touchedFields = this.store.touchedFields;
  readonly fieldErrors = this.store.fieldErrors;
  readonly isFormValid = this.store.isFormValid;
  readonly lastSubmittedSpeaker = this.store.lastSubmittedSpeaker;
  readonly submissionError = this.store.submissionError;

  /* ── Actions ── */
  updateField(field: CfpField, value: string): void {
    this.store.setField(field, value);
  }

  touchField(field: string): void {
    this.store.touchField(field);
  }

  updateGDE(isGDE: boolean): void {
    this.store.setGDE(isGDE);
  }

  submitProposal(): Observable<Speaker> | null {
    if (!this.store.isFormValid() || this.store.isSubmitting()) {
      return null;
    }

    this.store.setSubmitting(true);

    const speaker: Speaker = {
      id:
        this.store.id() ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `speaker-${Date.now()}`),
      nome: this.store.nome().trim(),
      email: this.store.email().trim(),
      talkTitle: this.store.talkTitle().trim(),
      isGDE: this.store.isGDE(),
    };

    return this.repository.submitProposal(speaker).pipe(
      tap({
        next: (saved) => this.store.setSubmitted(saved),
        error: (err) =>
          this.store.setError(err.message || 'Erro ao submeter proposta.'),
      })
    );
  }

  clearNotification(): void {
    this.store.clearNotification();
  }

  resetForm(): void {
    this.store.reset();
  }
}
