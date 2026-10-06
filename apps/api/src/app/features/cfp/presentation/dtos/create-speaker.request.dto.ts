import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpeakerRequestDto {
  @ApiPropertyOptional({
    description: 'ID do palestrante (gerado se não informado)',
    example: 'speaker-123',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiProperty({ description: 'Nome completo do palestrante', example: 'Ada Lovelace' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ description: 'Endereço de e-mail do palestrante', example: 'ada@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Título da palestra', example: 'A Primeira Algoritmo' })
  @IsString()
  @IsNotEmpty()
  talkTitle!: string;

  @ApiProperty({ description: 'Indica se é um Google Developer Expert', example: true })
  @IsBoolean()
  isGDE!: boolean;
}
