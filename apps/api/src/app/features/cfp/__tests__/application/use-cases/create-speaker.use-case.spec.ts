import { CreateSpeakerUseCase } from '../../../application/use-cases/create-speaker.use-case';
import { CfpInMemoryAdapter } from '../../../infrastructure/adapters/cfp-in-memory.adapter';

describe('CreateSpeakerUseCase', () => {
  let useCase: CreateSpeakerUseCase;
  let adapter: CfpInMemoryAdapter;

  beforeEach(() => {
    adapter = new CfpInMemoryAdapter();
    useCase = new CreateSpeakerUseCase(adapter);
  });

  it('should create and save a new speaker proposal', async () => {
    const props = {
      id: 'speaker-10',
      nome: 'Alan Turing',
      email: 'alan@example.com',
      talkTitle: 'Computing Machinery and Intelligence',
      isGDE: false,
    };

    const result = await useCase.execute(props);

    expect(result.id).toBe('speaker-10');
    expect(result.nome).toBe('Alan Turing');
    expect(adapter.findAll()).toHaveLength(1);
  });
});
