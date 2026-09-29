import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CfpHttpAdapter } from '../../infrastructure/adapters/cfp-http.adapter';
import { Speaker } from '../../domain/entities/speaker.entity';
import { SpeakerApiDTO } from '../../infrastructure/http/cfp.dtos';

describe('CfpHttpAdapter (Infrastructure)', () => {
  let adapter: CfpHttpAdapter;
  let httpTesting: HttpTestingController;

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
    const inputSpeaker: Speaker = {
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

    let resultSpeaker: Speaker | undefined;

    adapter.submitProposal(inputSpeaker).subscribe((res) => {
      resultSpeaker = res;
    });

    const req = httpTesting.expectOne('/api/cfp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockResponseDto);

    req.flush(mockResponseDto);

    expect(resultSpeaker).toEqual(inputSpeaker);
  });
});
