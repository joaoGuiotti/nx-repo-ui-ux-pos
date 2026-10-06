import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSpeakerUseCase } from '../../application/use-cases/create-speaker.use-case';
import { FindAllSpeakersUseCase } from '../../application/use-cases/find-all-speakers.use-case';
import { CreateSpeakerRequestDto } from '../dtos/create-speaker.request.dto';
import { SpeakerResponseDto } from '../dtos/speaker.response.dto';
import { SpeakerMapper } from '../mappers/speaker.mapper';

@ApiTags('cfp')
@Controller('cfp')
export class CfpController {
  constructor(
    private readonly createSpeakerUseCase: CreateSpeakerUseCase,
    private readonly findAllSpeakersUseCase: FindAllSpeakersUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submeter proposta de palestra / palestrante' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Proposta submetida com sucesso',
    type: SpeakerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados da requisição inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Violação das regras de negócio do domínio',
  })
  async create(@Body() createSpeakerDto: CreateSpeakerRequestDto): Promise<SpeakerResponseDto> {
    const speakerEntity = await this.createSpeakerUseCase.execute(createSpeakerDto);
    return SpeakerMapper.toResponseDto(speakerEntity);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as propostas de palestras' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de propostas cadastradas',
    type: [SpeakerResponseDto],
  })
  async findAll(): Promise<SpeakerResponseDto[]> {
    const speakers = await this.findAllSpeakersUseCase.execute();
    return SpeakerMapper.toResponseDtoList(speakers);
  }
}
