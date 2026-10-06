import { SpeakerEntity } from '../../domain/entities/speaker.entity';
import { CfpValidationError } from '../../domain/errors/cfp-validation.error';

describe('SpeakerEntity', () => {
  const validProps = {
    id: 'speaker-1',
    nome: 'Grace Hopper',
    email: 'grace@example.com',
    talkTitle: 'COBOL Architecture',
    isGDE: true,
  };

  it('should create a valid SpeakerEntity instance', () => {
    const speaker = SpeakerEntity.create(validProps);

    expect(speaker.id).toBe('speaker-1');
    expect(speaker.nome).toBe('Grace Hopper');
    expect(speaker.email).toBe('grace@example.com');
    expect(speaker.talkTitle).toBe('COBOL Architecture');
    expect(speaker.isGDE).toBe(true);
  });

  it('should generate an id when id is empty or omitted', () => {
    const speaker = SpeakerEntity.create({ ...validProps, id: '' });

    expect(speaker.id).toBeDefined();
    expect(typeof speaker.id).toBe('string');
    expect(speaker.id.length).toBeGreaterThan(0);
  });

  it('should throw CfpValidationError when nome is empty', () => {
    expect(() => SpeakerEntity.create({ ...validProps, nome: '' })).toThrow(CfpValidationError);
  });

  it('should throw CfpValidationError when email is invalid', () => {
    expect(() => SpeakerEntity.create({ ...validProps, email: 'invalid-email' })).toThrow(
      CfpValidationError
    );
  });

  it('should throw CfpValidationError when talkTitle is empty', () => {
    expect(() => SpeakerEntity.create({ ...validProps, talkTitle: '   ' })).toThrow(
      CfpValidationError
    );
  });
});
