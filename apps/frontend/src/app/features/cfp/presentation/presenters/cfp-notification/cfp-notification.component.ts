import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAlertCircle, LucideCheckCircle2, LucideX } from '@lucide/angular';

export type NotificationType = 'success' | 'error' | 'info';

/**
 * Dumb Presenter Component — Displays feedback notifications (Success/Error).
 *
 * @guardrail 100% visual, zero service injections.
 * Styled exclusively with Tailwind CSS utilities consuming Design System tokens.
 * A11y compliant: WAI-ARIA role="status" / role="alert", keyboard accessible.
 */
@Component({
  selector: 'app-cfp-notification',
  standalone: true,
  imports: [LucideCheckCircle2, LucideAlertCircle, LucideX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cfp-notification.component.html',
})
export class CfpNotificationComponent {
  /* ── Inputs ── */
  readonly type = input.required<NotificationType>();
  readonly title = input<string>('');
  readonly message = input.required<string>();
  readonly dismissible = input<boolean>(true);

  /* ── Outputs ── */
  readonly dismissed = output<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }
}
