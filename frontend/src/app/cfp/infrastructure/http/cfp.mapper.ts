import { Speaker } from '../../domain/entities/speaker.entity';
import { SpeakerApiDTO } from './cfp.dtos';

/**
 * Mapper responsible for translating between API DTOs and Domain Entities.
 *
 * @guardrail Enforces boundary between external API contracts and pure business domain.
 */
export class CfpMapper {
  /** Converts API DTO to pure Domain Entity */
  static toDomain(dto: SpeakerApiDTO): Speaker {
    return {
      id: dto.id,
      nome: dto.nome,
      email: dto.email,
      talkTitle: dto.talkTitle,
      isGDE: dto.isGDE,
    };
  }

  /** Converts pure Domain Entity to API DTO payload */
  static toDTO(entity: Speaker): SpeakerApiDTO {
    return {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      talkTitle: entity.talkTitle,
      isGDE: entity.isGDE,
    };
  }
}
