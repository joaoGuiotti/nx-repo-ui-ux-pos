import { SpeakerEntity } from '../../../domain/entities/speaker.entity';
import { SpeakerMapper } from '../../../presentation/mappers/speaker.mapper';

describe('SpeakerMapper', () => {
  it('should map SpeakerEntity to SpeakerResponseDto', () => {
    const entity = SpeakerEntity.create({
      id: 'speaker-99',
      nome: 'Dennis Ritchie',
      email: 'dennis@example.com',
      talkTitle: 'The C Programming Language',
      isGDE: false,
    });

    const dto = SpeakerMapper.toResponseDto(entity);

    expect(dto).toEqual({
      id: 'speaker-99',
      nome: 'Dennis Ritchie',
      email: 'dennis@example.com',
      talkTitle: 'The C Programming Language',
      isGDE: false,
    });
  });

  it('should map array of SpeakerEntity to array of SpeakerResponseDto', () => {
    const entities = [
      SpeakerEntity.create({
        id: 'speaker-1',
        nome: 'Ken Thompson',
        email: 'ken@example.com',
        talkTitle: 'Unix Operating System',
        isGDE: true,
      }),
    ];

    const dtoList = SpeakerMapper.toResponseDtoList(entities);

    expect(dtoList).toHaveLength(1);
    expect(dtoList[0].id).toBe('speaker-1');
  });
});
