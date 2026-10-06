/** Union type for validatable CFP form fields. */
export type CfpField = 'nome' | 'email' | 'talkTitle';

/** Payload emitted when a text input value changes. */
export interface CfpFieldInputEvent {
  readonly field: CfpField;
  readonly value: string;
}
