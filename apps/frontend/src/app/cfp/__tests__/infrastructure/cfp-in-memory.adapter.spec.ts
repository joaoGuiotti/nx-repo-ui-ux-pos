import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CfpInMemoryAdapter } from '../../infrastructure/adapters/cfp-in-memory.adapter';
import { Speaker } from '../../domain/entities/speaker.entity';

describe('CfpInMemoryAdapter (Infrastructure)', () => {
  let adapter: CfpInMemoryAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CfpInMemoryAdapter],
    });
    adapter = TestBed.inject(CfpInMemoryAdapter);
  });

  it('deve armazenar e retornar a proposta enviada com ID gerado', async () => {
    const speaker: Speaker = {
      id: '',
      nome: 'Dev Teste',
      email: 'dev@test.com',
      talkTitle: 'Testes de Integração com Angular',
      isGDE: false,
    };

    const saved = await firstValueFrom(adapter.submitProposal(speaker));

    expect(saved.nome).toBe(speaker.nome);
    expect(saved.email).toBe(speaker.email);
    expect(saved.talkTitle).toBe(speaker.talkTitle);
    expect(saved.id).toBeTruthy();
  });
});
