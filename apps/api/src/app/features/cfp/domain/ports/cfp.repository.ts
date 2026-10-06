import { SpeakerEntity } from '../entities/speaker.entity';

export abstract class CfpRepository {
  abstract save(speaker: SpeakerEntity): Promise<SpeakerEntity> | SpeakerEntity;
  abstract findAll(): Promise<SpeakerEntity[]> | SpeakerEntity[];
}
