import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-plataform/shared-types';
import { CfpService } from './cfp.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

@Controller('cfp')
export class CfpController {
  constructor(private readonly cfpService: CfpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSpeakerDto: CreateSpeakerDto): SpeakerDTO {
    return this.cfpService.create(createSpeakerDto);
  }
}
