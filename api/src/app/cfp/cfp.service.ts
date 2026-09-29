import { Injectable } from '@nestjs/common';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { SpeakerDTO } from '@cfp-plataform/shared-types';
import { randomUUID } from 'crypto';

@Injectable()
export class CfpService {
  private readonly submissions: SpeakerDTO[] = [];

  create(dto: CreateSpeakerDto): SpeakerDTO {
    const speaker: SpeakerDTO = {
      ...dto,
      id: dto.id || randomUUID(),
    };
    this.submissions.push(speaker);
    return speaker;
  }

  findAll(): SpeakerDTO[] {
    return [...this.submissions];
  }
}
