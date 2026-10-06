/**
 * Pure Domain Entity representing a Speaker proposal.
 *
 * @guardrail Strictly decoupled from framework — zero Angular imports (no HttpClient, no Injectable).
 */
export interface Speaker {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly talkTitle: string;
  readonly isGDE: boolean;
}
