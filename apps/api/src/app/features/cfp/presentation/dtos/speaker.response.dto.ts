import { ApiProperty } from '@nestjs/swagger';

export class SpeakerResponseDto {
  @ApiProperty({ description: 'Identificador único', example: 'speaker-123' })
  id!: string;

  @ApiProperty({ description: 'Nome completo', example: 'Ada Lovelace' })
  nome!: string;

  @ApiProperty({ description: 'E-mail', example: 'ada@example.com' })
  email!: string;

  @ApiProperty({ description: 'Título da palestra', example: 'A Primeira Algoritmo' })
  talkTitle!: string;

  @ApiProperty({ description: 'Status GDE', example: true })
  isGDE!: boolean;
}
