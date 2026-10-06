import { TestBed } from '@angular/core/testing';
import { CfpSignalStore } from '../../application/state/cfp.signal-store';
import { Speaker } from '../../domain/entities/speaker.entity';

describe('CfpSignalStore (Application)', () => {
  let store: CfpSignalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CfpSignalStore],
    });
    store = TestBed.inject(CfpSignalStore);
  });

  it('deve inicializar com valores padrão e estado idle', () => {
    expect(store.nome()).toBe('');
    expect(store.email()).toBe('');
    expect(store.talkTitle()).toBe('');
    expect(store.isGDE()).toBe(false);
    expect(store.status()).toBe('idle');
    expect(store.isSubmitting()).toBe(false);
    expect(store.isFormValid()).toBe(false);
  });

  it('deve validar e-mail incorreto', () => {
    store.setField('nome', 'Maria');
    store.setField('email', 'email-invalido');
    store.setField('talkTitle', 'Minha Palestra');

    expect(store.fieldErrors().email).toBe('Informe um e-mail válido.');
    expect(store.isFormValid()).toBe(false);
  });

  it('deve validar campos obrigatórios e tornar formulário válido quando preenchidos corretamente', () => {
    store.setField('nome', 'Maria Silva');
    store.setField('email', 'maria@domain.com');
    store.setField('talkTitle', 'Clean Architecture no Frontend');

    expect(store.fieldErrors().nome).toBeNull();
    expect(store.fieldErrors().email).toBeNull();
    expect(store.fieldErrors().talkTitle).toBeNull();
    expect(store.isFormValid()).toBe(true);
  });

  it('deve gerenciar estados de submissão, sucesso e erro', () => {
    store.setSubmitting(true);
    expect(store.status()).toBe('submitting');
    expect(store.isSubmitting()).toBe(true);

    const speaker: Speaker = {
      id: 'spk-1',
      nome: 'Maria Silva',
      email: 'maria@domain.com',
      talkTitle: 'Clean Architecture',
      isGDE: true,
    };

    store.setSubmitted(speaker);
    expect(store.status()).toBe('success');
    expect(store.isSubmitting()).toBe(false);
    expect(store.lastSubmittedSpeaker()).toEqual(speaker);

    store.setError('Erro ao enviar');
    expect(store.status()).toBe('error');
    expect(store.submissionError()).toBe('Erro ao enviar');

    store.clearNotification();
    expect(store.status()).toBe('idle');
    expect(store.lastSubmittedSpeaker()).toBeNull();
    expect(store.submissionError()).toBeNull();
  });
});
