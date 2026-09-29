import { Test, TestingModule } from '@nestjs/testing';
import { CfpController } from './cfp.controller';
import { CfpService } from './cfp.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

describe('CfpController (Backend)', () => {
  let controller: CfpController;
  let service: CfpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CfpController],
      providers: [CfpService],
    }).compile();

    controller = module.get<CfpController>(CfpController);
    service = module.get<CfpService>(CfpService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('deve receber um payload válido e criar uma proposta com sucesso', () => {
    const dto: CreateSpeakerDto = {
      id: 'spk-1',
      nome: 'João Silva',
      email: 'joao@example.com',
      talkTitle: 'NestJS e Angular Monorepo',
      isGDE: true,
    };

    const result = controller.create(dto);

    expect(result).toBeDefined();
    expect(result.id).toBe('spk-1');
    expect(result.nome).toBe('João Silva');
    expect(result.email).toBe('joao@example.com');
    expect(result.talkTitle).toBe('NestJS e Angular Monorepo');
    expect(result.isGDE).toBe(true);
  });

  it('deve gerar id automático caso não seja fornecido', () => {
    const dto: CreateSpeakerDto = {
      id: '',
      nome: 'Maria Souza',
      email: 'maria@example.com',
      talkTitle: 'Microfrontends',
      isGDE: false,
    };

    const result = controller.create(dto);

    expect(result.id).toBeTruthy();
    expect(result.nome).toBe('Maria Souza');
  });
});
