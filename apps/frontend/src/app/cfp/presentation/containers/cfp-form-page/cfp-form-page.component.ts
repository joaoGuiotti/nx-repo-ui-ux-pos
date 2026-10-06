import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { SpeakerDTO } from '@cfp-plataform/shared-types';
import { CfpFieldInputEvent } from '../../../domain/entities/cfp-form.types';
import { CfpFacade } from '../../../application/facades/cfp.facade';
import { CfpFormComponent } from '../../presenters/cfp-form/cfp-form.component';
import { CfpNotificationComponent } from '../../presenters/cfp-notification/cfp-notification.component';

/**
 * Smart Container component — orchestrates feature state through CfpFacade.
 *
 * @guardrail Injects ONLY the Facade. Zero direct adapter or HTTP injections.
 * Template coordinates feedback notifications and delegates form rendering to CfpFormComponent.
 */
@Component({
  selector: 'app-cfp-form-page',
  standalone: true,
  imports: [CfpFormComponent, CfpNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfp-form-page.component.html',
})
export class CfpFormPageComponent {
  private readonly facade = inject(CfpFacade);

  /* ── Signals exposed from Facade ── */
  readonly id = this.facade.id;
  readonly nome = this.facade.nome;
  readonly email = this.facade.email;
  readonly talkTitle = this.facade.talkTitle;
  readonly isGDE = this.facade.isGDE;
  readonly isSubmitting = this.facade.isSubmitting;
  readonly touchedFields = this.facade.touchedFields;
  readonly fieldErrors = this.facade.fieldErrors;
  readonly isFormValid = this.facade.isFormValid;
  readonly lastSubmittedSpeaker = this.facade.lastSubmittedSpeaker;
  readonly submissionError = this.facade.submissionError;

  /* ── Output (for composability with parent components) ── */
  readonly submitted = output<SpeakerDTO>();

  /* ── Event Handlers (delegated to Facade) ── */

  /** Updates the corresponding field signal via Facade when user types. */
  onInputChanged(event: CfpFieldInputEvent): void {
    this.facade.updateField(event.field, event.value);
  }

  /** Marks a field as touched via Facade. */
  onFieldTouched(field: string): void {
    this.facade.touchField(field);
  }

  /** Updates the GDE checkbox state via Facade. */
  onGDEChanged(checked: boolean): void {
    this.facade.updateGDE(checked);
  }

  /** Handles form submission via Facade and emits to parent. */
  onFormSubmitted(): void {
    const sub$ = this.facade.submitProposal();
    if (sub$) {
      sub$.subscribe({
        next: (saved) => this.submitted.emit(saved),
      });
    }
  }

  /** Clears feedback notification. */
  onDismissNotification(): void {
    this.facade.clearNotification();
  }

  /** Resets form via Facade. */
  resetForm(): void {
    this.facade.resetForm();
  }
}
