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

  it('deve preservar o ID da proposta caso já esteja preenchido', async () => {
    const speaker: Speaker = {
      id: 'custom-id-123',
      nome: 'Dev Teste',
      email: 'dev@test.com',
      talkTitle: 'Testes de Integração com Angular',
      isGDE: false,
    };

    const saved = await firstValueFrom(adapter.submitProposal(speaker));

    expect(saved.id).toBe('custom-id-123');
  });

  it('deve gerar ID fallback com timestamp quando crypto.randomUUID não estiver disponível', async () => {
    const originalCrypto = globalThis.crypto;
    // Mock crypto to simulate environment without randomUUID
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
    });

    try {
      const speaker: Speaker = {
        id: '',
        nome: 'Dev Teste',
        email: 'dev@test.com',
        talkTitle: 'Testes sem Crypto',
        isGDE: false,
      };

      const saved = await firstValueFrom(adapter.submitProposal(speaker));

      expect(saved.id).toMatch(/^speaker-\d+$/);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        value: originalCrypto,
        configurable: true,
      });
    }
  });
});

