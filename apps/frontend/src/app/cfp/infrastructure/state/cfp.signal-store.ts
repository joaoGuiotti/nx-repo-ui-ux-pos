import { Injectable, computed, signal } from '@angular/core';
import { Speaker } from '../../domain/entities/speaker.entity';
import { CfpField } from '../../domain/entities/cfp-form.types';

export interface CfpState {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly talkTitle: string;
  readonly isGDE: boolean;
  readonly isSubmitting: boolean;
  readonly touchedFields: Record<string, boolean>;
  readonly lastSubmittedSpeaker: Speaker | null;
  readonly submissionError: string | null;
}

const initialState: CfpState = {
  id: '',
  nome: '',
  email: '',
  talkTitle: '',
  isGDE: false,
  isSubmitting: false,
  touchedFields: {},
  lastSubmittedSpeaker: null,
  submissionError: null,
};

/**
 * Reactive Signal Store managing CFP feature state.
 * Built exclusively with Angular Signals (`signal`, `computed`).
 */
@Injectable()
export class CfpSignalStore {
  private readonly state = signal<CfpState>(initialState);

  /* ── Selectors (Signals) ── */
  readonly id = computed(() => this.state().id);
  readonly nome = computed(() => this.state().nome);
  readonly email = computed(() => this.state().email);
  readonly talkTitle = computed(() => this.state().talkTitle);
  readonly isGDE = computed(() => this.state().isGDE);
  readonly isSubmitting = computed(() => this.state().isSubmitting);
  readonly touchedFields = computed(() => this.state().touchedFields);
  readonly lastSubmittedSpeaker = computed(() => this.state().lastSubmittedSpeaker);
  readonly submissionError = computed(() => this.state().submissionError);

  /* ── Computed Business / Validation Selectors ── */
  readonly fieldErrors = computed<Record<CfpField, string | null>>(() => {
    const nomeVal = this.nome().trim();
    const emailVal = this.email().trim();
    const talkTitleVal = this.talkTitle().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      nome: !nomeVal ? 'O nome é obrigatório.' : null,
      email: !emailVal
        ? 'O e-mail é obrigatório.'
        : !emailRegex.test(emailVal)
          ? 'Informe um e-mail válido.'
          : null,
      talkTitle: !talkTitleVal ? 'O título da palestra é obrigatório.' : null,
    };
  });

  readonly isFormValid = computed<boolean>(() => {
    const errors = this.fieldErrors();
    return !errors.nome && !errors.email && !errors.talkTitle;
  });

  /* ── Updaters / Actions ── */
  setField(field: CfpField, value: string): void {
    this.state.update((s) => ({ ...s, [field]: value }));
  }

  touchField(field: string): void {
    this.state.update((s) => ({
      ...s,
      touchedFields: { ...s.touchedFields, [field]: true },
    }));
  }

  setGDE(isGDE: boolean): void {
    this.state.update((s) => ({ ...s, isGDE }));
  }

  setSubmitting(isSubmitting: boolean): void {
    this.state.update((s) => ({ ...s, isSubmitting }));
  }

  setSubmitted(speaker: Speaker): void {
    this.state.update((s) => ({
      ...s,
      isSubmitting: false,
      lastSubmittedSpeaker: speaker,
      submissionError: null,
    }));
  }

  setError(error: string): void {
    this.state.update((s) => ({
      ...s,
      isSubmitting: false,
      submissionError: error,
    }));
  }

  clearNotification(): void {
    this.state.update((s) => ({
      ...s,
      lastSubmittedSpeaker: null,
      submissionError: null,
    }));
  }

  reset(): void {
    this.state.set(initialState);
  }
}
