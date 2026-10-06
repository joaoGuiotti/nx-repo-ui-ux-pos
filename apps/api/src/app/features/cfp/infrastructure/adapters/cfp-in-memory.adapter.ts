import { Injectable } from '@nestjs/common';
import { SpeakerEntity } from '../../domain/entities/speaker.entity';
import { CfpRepository } from '../../domain/ports/cfp.repository';

@Injectable()
export class CfpInMemoryAdapter extends CfpRepository {
  private readonly submissions: SpeakerEntity[] = [];

  save(speaker: SpeakerEntity): SpeakerEntity {
    this.submissions.push(speaker);
    return speaker;
  }

  findAll(): SpeakerEntity[] {
    return [...this.submissions];
  }
}
