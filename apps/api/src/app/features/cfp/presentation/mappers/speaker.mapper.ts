import { SpeakerEntity } from '../../domain/entities/speaker.entity';
import { SpeakerResponseDto } from '../dtos/speaker.response.dto';

export class SpeakerMapper {
  static toResponseDto(entity: SpeakerEntity): SpeakerResponseDto {
    return {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      talkTitle: entity.talkTitle,
      isGDE: entity.isGDE,
    };
  }

  static toResponseDtoList(entities: SpeakerEntity[]): SpeakerResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
