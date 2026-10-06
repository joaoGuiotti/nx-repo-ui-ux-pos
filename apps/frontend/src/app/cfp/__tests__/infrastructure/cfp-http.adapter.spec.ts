import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  CfpHttpAdapter,
  CfpDomainError,
} from '../../infrastructure/adapters/cfp-http.adapter';
import { Speaker } from '../../domain/entities/speaker.entity';
import { SpeakerApiDTO } from '../../infrastructure/http/cfp.dtos';

describe('CfpHttpAdapter (Infrastructure)', () => {
  let adapter: CfpHttpAdapter;
  let httpTesting: HttpTestingController;

  const mockSpeaker: Speaker = {
    id: 'spk-456',
    nome: 'Carlos Lima',
    email: 'carlos@example.com',
    talkTitle: 'Arquitetura Hexagonal com Angular',
    isGDE: true,
  };

  const mockResponseDto: SpeakerApiDTO = {
    id: 'spk-456',
    nome: 'Carlos Lima',
    email: 'carlos@example.com',
    talkTitle: 'Arquitetura Hexagonal com Angular',
    isGDE: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CfpHttpAdapter,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    adapter = TestBed.inject(CfpHttpAdapter);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve enviar POST /api/cfp com payload DTO e retornar Entidade de Domínio', () => {
    let resultSpeaker: Speaker | undefined;

    adapter.submitProposal(mockSpeaker).subscribe((res) => {
      resultSpeaker = res;
    });

    const req = httpTesting.expectOne('/api/cfp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockResponseDto);

    req.flush(mockResponseDto);

    expect(resultSpeaker).toEqual(mockSpeaker);
  });

  it('deve instanciar CfpDomainError corretamente com mensagem e status', () => {
    const error = new CfpDomainError('Erro personalizado', 422);
    expect(error.name).toBe('CfpDomainError');
    expect(error.message).toBe('Erro personalizado');
    expect(error.status).toBe(422);
  });

  it('deve converter HttpErrorResponse com error.message para CfpDomainError', () => {
    let thrownError: CfpDomainError | undefined;

    adapter.submitProposal(mockSpeaker).subscribe({
      next: () => expect.fail('Deveria ter falhado'),
      error: (err) => {
        thrownError = err;
      },
    });

    const req = httpTesting.expectOne('/api/cfp');
    req.flush(
      { message: 'Erro de validação do backend' },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(thrownError).toBeInstanceOf(CfpDomainError);
    expect(thrownError?.message).toBe('Erro de validação do backend');
    expect(thrownError?.status).toBe(400);
  });

  it('deve converter HttpErrorResponse sem error.message usando o erro/mensagem padrao', () => {
    let thrownError: CfpDomainError | undefined;

    adapter.submitProposal(mockSpeaker).subscribe({
      next: () => expect.fail('Deveria ter falhado'),
      error: (err) => {
        thrownError = err;
      },
    });

    const req = httpTesting.expectOne('/api/cfp');
    req.flush('Erro inesperado', { status: 500, statusText: 'Internal Server Error' });

    expect(thrownError).toBeInstanceOf(CfpDomainError);
    expect(thrownError?.status).toBe(500);
    expect(thrownError?.message).toBeTruthy();
  });
});

