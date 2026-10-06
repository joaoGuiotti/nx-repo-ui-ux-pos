import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import { CfpFacade } from '../../application/facades/cfp.facade';
import { CfpRepository } from '../../domain/ports/cfp.repository';
import { CfpSignalStore } from '../../application/state/cfp.signal-store';
import { Speaker } from '../../domain/entities/speaker.entity';

describe('CfpFacade (Application)', () => {
  let facade: CfpFacade;
  let mockRepository: { submitProposal: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepository = {
      submitProposal: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [CfpSignalStore, CfpFacade, { provide: CfpRepository, useValue: mockRepository }],
    });

    facade = TestBed.inject(CfpFacade);
  });

  it('deve orquestrar atualização de campos no store', () => {
    facade.updateField('nome', 'Ana Beatriz');
    facade.updateField('email', 'ana@example.com');
    facade.updateField('talkTitle', 'Design System com Tailwind');
    facade.updateGDE(true);

    expect(facade.nome()).toBe('Ana Beatriz');
    expect(facade.email()).toBe('ana@example.com');
    expect(facade.talkTitle()).toBe('Design System com Tailwind');
    expect(facade.isGDE()).toBe(true);
    expect(facade.isFormValid()).toBe(true);
  });

  it('deve submeter a proposta chamando o repositório quando o formulário for válido', async () => {
    facade.updateField('nome', 'Ana Beatriz');
    facade.updateField('email', 'ana@example.com');
    facade.updateField('talkTitle', 'Design System com Tailwind');

    const expectedSaved: Speaker = {
      id: 'spk-999',
      nome: 'Ana Beatriz',
      email: 'ana@example.com',
      talkTitle: 'Design System com Tailwind',
      isGDE: false,
    };

    mockRepository.submitProposal.mockReturnValue(of(expectedSaved));

    const obs$ = facade.submitProposal();
    expect(obs$).not.toBeNull();
    if (!obs$) {
      throw new Error('obs$ should not be null');
    }

    const res = await firstValueFrom(obs$);
    expect(mockRepository.submitProposal).toHaveBeenCalled();
    expect(res).toEqual(expectedSaved);
    expect(facade.lastSubmittedSpeaker()).toEqual(expectedSaved);
    expect(facade.isSubmitting()).toBe(false);
  });

  it('deve retornar null e não chamar o repositório se o formulário for inválido', () => {
    const obs$ = facade.submitProposal();
    expect(obs$).toBeNull();
    expect(mockRepository.submitProposal).not.toHaveBeenCalled();
  });
});
