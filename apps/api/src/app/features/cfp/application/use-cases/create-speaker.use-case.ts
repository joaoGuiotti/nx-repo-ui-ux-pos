import { Injectable } from '@nestjs/common';
import { CreateSpeakerProps, SpeakerEntity } from '../../domain/entities/speaker.entity';
import { CfpRepository } from '../../domain/ports/cfp.repository';

@Injectable()
export class CreateSpeakerUseCase {
  constructor(private readonly cfpRepository: CfpRepository) {}

  async execute(props: CreateSpeakerProps): Promise<SpeakerEntity> {
    const speaker = SpeakerEntity.create(props);
    return await this.cfpRepository.save(speaker);
  }
}
