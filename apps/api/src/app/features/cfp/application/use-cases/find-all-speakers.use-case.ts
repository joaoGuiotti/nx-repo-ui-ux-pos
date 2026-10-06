import { Injectable } from '@nestjs/common';
import { SpeakerEntity } from '../../domain/entities/speaker.entity';
import { CfpRepository } from '../../domain/ports/cfp.repository';

@Injectable()
export class FindAllSpeakersUseCase {
  constructor(private readonly cfpRepository: CfpRepository) {}

  async execute(): Promise<SpeakerEntity[]> {
    return await this.cfpRepository.findAll();
  }
}
