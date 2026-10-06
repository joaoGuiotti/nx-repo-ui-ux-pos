import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideLoaderCircle, LucideMail, LucideMic, LucideSend, LucideUser } from '@lucide/angular';
import { CfpField, CfpFieldInputEvent } from '../../../domain/entities/cfp-form.types';

/**
 * Dumb Presenter component — 100% visual.
 *
 * Receives all state via `input()` signals and notifies user actions via `output()`.
 * Zero business logic. All styling consumes Design Tokens (`var(--...)`).
 * Accessibility: WCAG 2.2 AA, WAI-ARIA, keyboard navigation, `:focus-visible`.
 *
 * @guardrail No constructor injections. No service dependencies. Only input()/output().
 */
@Component({
  selector: 'app-cfp-form',
  standalone: true,
  imports: [LucideUser, LucideMail, LucideMic, LucideSend, LucideLoaderCircle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfp-form.component.html',
})
export class CfpFormComponent {
  /* ── Inputs (state from Container) ── */
  readonly nome = input.required<string>();
  readonly email = input.required<string>();
  readonly talkTitle = input.required<string>();
  readonly isGDE = input.required<boolean>();
  readonly isSubmitting = input.required<boolean>();
  readonly fieldErrors = input.required<Record<CfpField, string | null>>();
  readonly touchedFields = input.required<Record<string, boolean>>();
  readonly isFormValid = input.required<boolean>();

  /* ── Outputs (user actions → Container) ── */
  readonly inputChanged = output<CfpFieldInputEvent>();
  readonly fieldTouched = output<string>();
  readonly gdeChanged = output<boolean>();
  readonly formSubmitted = output<void>();

  /**
   * Determines whether a field should visually display its error state.
   * Only shows errors after the user has interacted with (touched) the field.
   *
   * @param field - The field name to check
   * @returns `true` if field is both touched and has validation errors
   */
  isFieldTouchedAndInvalid(field: CfpField): boolean {
    return Boolean(this.touchedFields()[field] && this.fieldErrors()[field]);
  }

  /** Handles text input changes and emits to Container. */
  onFieldInput(field: CfpField, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputChanged.emit({ field, value: target?.value ?? '' });
  }

  /** Marks a field as touched when it loses focus. */
  onFieldBlur(field: string): void {
    this.fieldTouched.emit(field);
  }

  /** Handles the GDE checkbox toggle. */
  onGDEChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gdeChanged.emit(target.checked);
  }

  /** Intercepts form submission, focuses first invalid field if invalid, and delegates to Container. */
  onFormSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      const fields: CfpField[] = ['nome', 'email', 'talkTitle'];
      fields.forEach((f) => this.fieldTouched.emit(f));

      const errors = this.fieldErrors();
      const firstInvalidField = fields.find((f) => Boolean(errors[f]));
      if (firstInvalidField) {
        const el = document.getElementById(`cfp-${firstInvalidField}`);
        el?.focus();
      }
      return;
    }

    this.formSubmitted.emit();
  }
}
