import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { CfpFormComponent } from '../../presentation/presenters/cfp-form/cfp-form.component';
import { CfpField, CfpFieldInputEvent } from '../../domain/entities/cfp-form.types';

@Component({
  standalone: true,
  imports: [CfpFormComponent],
  template: `
    <app-cfp-form
      [nome]="nome()"
      [email]="email()"
      [talkTitle]="talkTitle()"
      [isGDE]="isGDE()"
      [isSubmitting]="isSubmitting()"
      [fieldErrors]="fieldErrors()"
      [touchedFields]="touchedFields()"
      [isFormValid]="isFormValid()"
      (inputChanged)="onInputChanged($event)"
      (fieldTouched)="onFieldTouched($event)"
      (gdeChanged)="onGDEChanged($event)"
      (formSubmitted)="onFormSubmitted()"
    />
  `,
})
class TestHostComponent {
  nome = signal('');
  email = signal('');
  talkTitle = signal('');
  isGDE = signal(false);
  isSubmitting = signal(false);
  fieldErrors = signal<Record<CfpField, string | null>>({
    nome: 'O nome é obrigatório.',
    email: null,
    talkTitle: null,
  });
  touchedFields = signal<Record<string, boolean>>({});
  isFormValid = signal(false);

  lastInputEvent: CfpFieldInputEvent | null = null;
  lastTouchedField: string | null = null;
  lastGDE: boolean | null = null;
  submitted = false;

  onInputChanged(event: CfpFieldInputEvent): void {
    this.lastInputEvent = event;
  }

  onFieldTouched(field: string): void {
    this.lastTouchedField = field;
  }

  onGDEChanged(checked: boolean): void {
    this.lastGDE = checked;
  }

  onFormSubmitted(): void {
    this.submitted = true;
  }
}

describe('CfpFormComponent (Presenter)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve renderizar os campos do formulário', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#cfp-nome')).toBeTruthy();
    expect(compiled.querySelector('#cfp-email')).toBeTruthy();
    expect(compiled.querySelector('#cfp-talkTitle')).toBeTruthy();
    expect(compiled.querySelector('#cfp-isGDE')).toBeTruthy();
  });

  it('deve emitir inputChanged ao digitar em um campo', () => {
    const input = fixture.nativeElement.querySelector('#cfp-nome') as HTMLInputElement;
    input.value = 'Lucas Silva';
    input.dispatchEvent(new Event('input'));

    expect(host.lastInputEvent).toEqual({ field: 'nome', value: 'Lucas Silva' });
  });

  it('deve emitir fieldTouched ao desfocar o campo (blur)', () => {
    const input = fixture.nativeElement.querySelector('#cfp-nome') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));

    expect(host.lastTouchedField).toBe('nome');
  });

  it('deve emitir gdeChanged ao alternar a checkbox GDE', () => {
    const checkbox = fixture.nativeElement.querySelector('#cfp-isGDE') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(host.lastGDE).toBe(true);
  });

  it('deve emitir formSubmitted quando o formulário for válido e for submetido', () => {
    host.isFormValid.set(true);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(host.submitted).toBe(true);
  });
});
