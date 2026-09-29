import { Injectable } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-plataform/shared-types';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

@Injectable()
export class CfpService {
  private readonly submissions: SpeakerDTO[] = [];

  create(createSpeakerDto: CreateSpeakerDto): SpeakerDTO {
    const speaker: SpeakerDTO = {
      ...createSpeakerDto,
      id: createSpeakerDto.id || Date.now().toString(),
    };
    this.submissions.push(speaker);
    return speaker;
  }

  findAll(): SpeakerDTO[] {
    return this.submissions;
  }
}
