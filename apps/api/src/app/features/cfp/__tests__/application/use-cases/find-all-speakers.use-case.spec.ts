import { FindAllSpeakersUseCase } from '../../../application/use-cases/find-all-speakers.use-case';
import { SpeakerEntity } from '../../../domain/entities/speaker.entity';
import { CfpInMemoryAdapter } from '../../../infrastructure/adapters/cfp-in-memory.adapter';

describe('FindAllSpeakersUseCase', () => {
  let useCase: FindAllSpeakersUseCase;
  let adapter: CfpInMemoryAdapter;

  beforeEach(() => {
    adapter = new CfpInMemoryAdapter();
    useCase = new FindAllSpeakersUseCase(adapter);
  });

  it('should return all speaker proposals', async () => {
    const speaker1 = SpeakerEntity.create({
      id: 'speaker-1',
      nome: 'Ada Lovelace',
      email: 'ada@example.com',
      talkTitle: 'Analytical Engine',
      isGDE: true,
    });
    adapter.save(speaker1);

    const speakers = await useCase.execute();

    expect(speakers).toHaveLength(1);
    expect(speakers[0].id).toBe('speaker-1');
  });
});
