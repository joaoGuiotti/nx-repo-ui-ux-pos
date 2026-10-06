import { SpeakerEntity } from '../../../domain/entities/speaker.entity';
import { CfpInMemoryAdapter } from '../../../infrastructure/adapters/cfp-in-memory.adapter';

describe('CfpInMemoryAdapter', () => {
  let adapter: CfpInMemoryAdapter;

  beforeEach(() => {
    adapter = new CfpInMemoryAdapter();
  });

  it('should start with an empty list', () => {
    expect(adapter.findAll()).toEqual([]);
  });

  it('should store and return saved speaker entity', () => {
    const speaker = SpeakerEntity.create({
      id: 'sub-1',
      nome: 'Speaker One',
      email: 'one@example.com',
      talkTitle: 'Talk One',
      isGDE: false,
    });

    const saved = adapter.save(speaker);

    expect(saved).toEqual(speaker);
    expect(adapter.findAll()).toHaveLength(1);
    expect(adapter.findAll()[0].id).toBe('sub-1');
  });
});
