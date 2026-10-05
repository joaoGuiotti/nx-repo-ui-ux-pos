import { Test, TestingModule } from '@nestjs/testing';
import { CfpService } from '../../cfp.service';
import { CreateSpeakerDto } from '../../dto/create-speaker.dto';

describe('CfpService', () => {
  let service: CfpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CfpService],
    }).compile();

    service = module.get<CfpService>(CfpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start with an empty submissions list', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('should create a speaker proposal retaining provided id', () => {
    const dto: CreateSpeakerDto = {
      id: 'custom-id-123',
      nome: 'Brendan Eich',
      email: 'brendan@example.com',
      talkTitle: 'The Evolution of JavaScript',
      isGDE: false,
    };

    const result = service.create(dto);

    expect(result).toEqual(dto);
    expect(result.id).toBe('custom-id-123');
    expect(service.findAll()).toContainEqual(dto);
  });

  it('should generate a string id when empty id is provided in dto', () => {
    const dto: CreateSpeakerDto = {
      id: '',
      nome: 'Guido van Rossum',
      email: 'guido@example.com',
      talkTitle: 'Python Design Decisions',
      isGDE: true,
    };

    const result = service.create(dto);

    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
    expect(result.nome).toBe('Guido van Rossum');
    expect(result.email).toBe('guido@example.com');
    expect(service.findAll().length).toBe(1);
    expect(service.findAll()[0].id).toBe(result.id);
  });

  it('should accumulate multiple submissions in memory', () => {
    service.create({
      id: 'sub-1',
      nome: 'Speaker One',
      email: 'one@example.com',
      talkTitle: 'Talk One',
      isGDE: false,
    });

    service.create({
      id: 'sub-2',
      nome: 'Speaker Two',
      email: 'two@example.com',
      talkTitle: 'Talk Two',
      isGDE: true,
    });

    const all = service.findAll();
    expect(all).toHaveLength(2);
    expect(all.map((s) => s.id)).toEqual(['sub-1', 'sub-2']);
  });
});
