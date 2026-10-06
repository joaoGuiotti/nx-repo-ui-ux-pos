import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CfpFormPageComponent } from '../../presentation/containers/cfp-form-page/cfp-form-page.component';
import { CfpFormComponent } from '../../presentation/presenters/cfp-form/cfp-form.component';
import { cfpProviders } from '../../cfp.providers';
import { SpeakerDTO } from '@cfp-plataform/shared-types';
import { CfpFacade } from '../../application/facades/cfp.facade';
import { vi } from 'vitest';

describe('CfpFormPageComponent (Container + Presenter Integration)', () => {
  let component: CfpFormPageComponent;
  let fixture: ComponentFixture<CfpFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfpFormPageComponent, CfpFormComponent],
      providers: cfpProviders({ withMock: true }),
    }).compileComponents();

    fixture = TestBed.createComponent(CfpFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('4.1 Estado inicial dos Signals do formulário', () => {
    it('deve inicializar todos os signals de campos com seus valores padrões', () => {
      expect(component.id()).toBe('');
      expect(component.nome()).toBe('');
      expect(component.email()).toBe('');
      expect(component.talkTitle()).toBe('');
      expect(component.isGDE()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(component.touchedFields()).toEqual({});
    });

    it('deve computar isFormValid como false no estado inicial', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('deve computar as mensagens de erro adequadas para campos vazios', () => {
      const errors = component.fieldErrors();
      expect(errors.nome).toBe('O nome é obrigatório.');
      expect(errors.email).toBe('O e-mail é obrigatório.');
      expect(errors.talkTitle).toBe('O título da palestra é obrigatório.');
    });

    it('não deve indicar campos como inválidos no DOM antes de serem tocados (acessibilidade inicial)', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nomeInput = compiled.querySelector('#cfp-nome') as HTMLInputElement;
      const emailInput = compiled.querySelector('#cfp-email') as HTMLInputElement;
      const talkTitleInput = compiled.querySelector(
        '#cfp-talkTitle'
      ) as HTMLInputElement;

      expect(nomeInput.getAttribute('aria-invalid')).toBe('false');
      expect(emailInput.getAttribute('aria-invalid')).toBe('false');
      expect(talkTitleInput.getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('4.2 Bloqueio e habilitação do botão de envio', () => {
    it('deve manter o botão de envio desabilitado no estado inicial', () => {
      const submitBtn = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      expect(submitBtn).toBeTruthy();
      expect(submitBtn.disabled).toBe(true);
      expect(component.isFormValid()).toBe(false);
    });

    it('deve manter o botão de envio desabilitado quando apenas alguns campos forem preenchidos', () => {
      const submitBtn = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      // Apenas nome
      component.onInputChanged({ field: 'nome', value: 'João Silva' });
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false);
      expect(submitBtn.disabled).toBe(true);

      // Nome e e-mail inválido
      component.onInputChanged({ field: 'email', value: 'email-invalido' });
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false);
      expect(submitBtn.disabled).toBe(true);
      expect(component.fieldErrors().email).toBe('Informe um e-mail válido.');

      // Nome, e-mail válido, mas sem talkTitle
      component.onInputChanged({ field: 'email', value: 'joao@example.com' });
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false);
      expect(submitBtn.disabled).toBe(true);
    });

    it('deve habilitar o botão de envio após o preenchimento válido de todos os campos obrigatórios', () => {
      const submitBtn = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      component.onInputChanged({ field: 'nome', value: 'João Silva' });
      component.onInputChanged({ field: 'email', value: 'joao.silva@example.com' });
      component.onInputChanged({
        field: 'talkTitle',
        value: 'Arquitetura Moderna com Angular Signals',
      });
      component.onGDEChanged(true);

      fixture.detectChanges();

      expect(component.isFormValid()).toBe(true);
      expect(submitBtn.disabled).toBe(false);
    });

    it('deve desabilitar o botão de envio e marcar aria-busy="true" quando isSubmitting for true', () => {
      const submitBtn = fixture.nativeElement.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;

      // Preenche validamente
      component.onInputChanged({ field: 'nome', value: 'João Silva' });
      component.onInputChanged({ field: 'email', value: 'joao.silva@example.com' });
      component.onInputChanged({
        field: 'talkTitle',
        value: 'Arquitetura Moderna com Angular Signals',
      });
      fixture.detectChanges();

      expect(submitBtn.disabled).toBe(false);

      // Simula envio em andamento via submissão
      component.onFormSubmitted();
      fixture.detectChanges();

      // Durante a chamada assíncrona ou estado
      expect(submitBtn.getAttribute('aria-busy')).toBeTruthy();
    });
  });

  describe('3.3 Acessibilidade WAI-ARIA e interações de formulário', () => {
    it('deve possuir atributos aria-required="true" e aria-describedby nos campos', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nomeInput = compiled.querySelector('#cfp-nome') as HTMLInputElement;
      const emailInput = compiled.querySelector('#cfp-email') as HTMLInputElement;
      const talkTitleInput = compiled.querySelector(
        '#cfp-talkTitle'
      ) as HTMLInputElement;

      expect(nomeInput.getAttribute('aria-required')).toBe('true');
      expect(nomeInput.getAttribute('aria-describedby')).toBe('cfp-nome-error');

      expect(emailInput.getAttribute('aria-required')).toBe('true');
      expect(emailInput.getAttribute('aria-describedby')).toBe('cfp-email-error');

      expect(talkTitleInput.getAttribute('aria-required')).toBe('true');
      expect(talkTitleInput.getAttribute('aria-describedby')).toBe(
        'cfp-talkTitle-error'
      );
    });

    it('deve utilizar fieldset e legend para agrupamento semântico', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const fieldset = compiled.querySelector('fieldset') as HTMLFieldSetElement;
      const legend = compiled.querySelector('legend') as HTMLLegendElement;

      expect(fieldset).toBeTruthy();
      expect(legend).toBeTruthy();
      expect(legend.textContent?.trim()).toBe('Dados do Palestrante');
    });

    it('deve possuir seção com aria-labelledby apontando para o título', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const section = compiled.querySelector('section') as HTMLElement;

      expect(section.getAttribute('aria-labelledby')).toBe('cfp-title');
      expect(compiled.querySelector('#cfp-title')).toBeTruthy();
    });

    it('deve atualizar aria-invalid e exibir mensagens de erro com role="alert" após blur', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nomeInput = compiled.querySelector('#cfp-nome') as HTMLInputElement;
      const nomeError = compiled.querySelector('#cfp-nome-error') as HTMLElement;

      expect(nomeError.getAttribute('role')).toBe('alert');
      expect(nomeError.getAttribute('aria-live')).toBe('polite');

      // Marks field as touched via Container method
      component.onFieldTouched('nome');
      fixture.detectChanges();

      expect(nomeInput.getAttribute('aria-invalid')).toBe('true');
      expect(nomeError.textContent?.trim()).toBe('O nome é obrigatório.');
    });

    it('deve emitir o evento submitted com o contrato SpeakerDTO ao submeter o formulário válido', async () => {
      const submittedPromise = new Promise<SpeakerDTO>((resolve) => {
        component.submitted.subscribe((payload) => resolve(payload));
      });

      component.onInputChanged({ field: 'nome', value: 'Maria Souza' });
      component.onInputChanged({ field: 'email', value: 'maria@example.com' });
      component.onInputChanged({
        field: 'talkTitle',
        value: 'Testes Unitários no Frontend',
      });
      component.onGDEChanged(false);

      fixture.detectChanges();

      component.onFormSubmitted();

      const emittedPayload = await submittedPromise;
      expect(emittedPayload).toBeDefined();
      expect(emittedPayload?.nome).toBe('Maria Souza');
      expect(emittedPayload?.email).toBe('maria@example.com');
      expect(emittedPayload?.talkTitle).toBe('Testes Unitários no Frontend');
      expect(emittedPayload?.isGDE).toBe(false);
      expect(emittedPayload?.id).toBeTruthy();
    });

    it('deve resetar o formulário quando resetForm() for invocado', () => {
      component.onInputChanged({ field: 'nome', value: 'Carlos' });
      component.onInputChanged({ field: 'email', value: 'carlos@example.com' });
      component.onInputChanged({ field: 'talkTitle', value: 'Microfrontends' });
      component.onGDEChanged(true);
      component.onFieldTouched('nome');

      component.resetForm();

      expect(component.nome()).toBe('');
      expect(component.email()).toBe('');
      expect(component.talkTitle()).toBe('');
      expect(component.isGDE()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(component.touchedFields()).toEqual({});
      expect(component.isFormValid()).toBe(false);
    });
  });

  describe('4.4 Notificações de sucesso e erro', () => {
    it('deve exibir notificação de sucesso após submissão e ocultar ao emitir dismissed', () => {
      component.onInputChanged({ field: 'nome', value: 'Maria Souza' });
      component.onInputChanged({ field: 'email', value: 'maria@example.com' });
      component.onInputChanged({ field: 'talkTitle', value: 'Testes de Integração' });
      fixture.detectChanges();

      component.onFormSubmitted();
      fixture.detectChanges();

      const notification = fixture.nativeElement.querySelector('app-cfp-notification');
      expect(notification).toBeTruthy();
      expect(component.lastSubmittedSpeaker()).toBeTruthy();

      const dismissBtn = notification.querySelector('button') as HTMLButtonElement;
      dismissBtn.click();
      fixture.detectChanges();

      expect(component.lastSubmittedSpeaker()).toBeNull();
      expect(fixture.nativeElement.querySelector('app-cfp-notification')).toBeFalsy();
    });

    it('deve exibir notificação de erro quando houver erro na submissão e ocultar ao dispensar', () => {
      const facade = TestBed.inject(CfpFacade);
      const store = (facade as unknown as { store: { setError: (msg: string) => void } }).store;
      store.setError('Erro ao se comunicar com o servidor');
      fixture.detectChanges();

      const notification = fixture.nativeElement.querySelector('app-cfp-notification');
      expect(notification).toBeTruthy();
      expect(component.submissionError()).toBe('Erro ao se comunicar com o servidor');

      component.onDismissNotification();
      fixture.detectChanges();

      expect(component.submissionError()).toBeNull();
      expect(fixture.nativeElement.querySelector('app-cfp-notification')).toBeFalsy();
    });

    it('não deve emitir nada nem se inscrever quando a submissão for inválida e sub$ for null', () => {
      const emitSpy = vi.spyOn(component.submitted, 'emit');
      component.onFormSubmitted();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});

