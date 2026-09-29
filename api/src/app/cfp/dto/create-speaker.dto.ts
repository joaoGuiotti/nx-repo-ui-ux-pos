import { SpeakerDTO } from '@cfp-plataform/shared-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSpeakerDto implements SpeakerDTO {
  @IsString()
  @IsOptional()
  id!: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome!: string;

  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'O título da palestra é obrigatório' })
  talkTitle!: string;

  @IsBoolean()
  isGDE!: boolean;
}
