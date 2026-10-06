import { CfpValidationError } from '../errors/cfp-validation.error';

export interface CreateSpeakerProps {
  id?: string;
  nome: string;
  email: string;
  talkTitle: string;
  isGDE: boolean;
}

export class SpeakerEntity {
  private constructor(
    private readonly _id: string,
    private readonly _nome: string,
    private readonly _email: string,
    private readonly _talkTitle: string,
    private readonly _isGDE: boolean
  ) {}

  public static create(props: CreateSpeakerProps): SpeakerEntity {
    if (!props.nome || props.nome.trim().length === 0) {
      throw new CfpValidationError('Nome é obrigatório e não pode ser vazio');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!props.email || !emailRegex.test(props.email)) {
      throw new CfpValidationError('E-mail inválido');
    }

    if (!props.talkTitle || props.talkTitle.trim().length === 0) {
      throw new CfpValidationError('Título da palestra é obrigatório');
    }

    if (typeof props.isGDE !== 'boolean') {
      throw new CfpValidationError('isGDE deve ser um valor booleano');
    }

    const id = props.id && props.id.trim().length > 0 ? props.id : Date.now().toString();

    return new SpeakerEntity(
      id,
      props.nome.trim(),
      props.email.trim(),
      props.talkTitle.trim(),
      props.isGDE
    );
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get email(): string {
    return this._email;
  }

  get talkTitle(): string {
    return this._talkTitle;
  }

  get isGDE(): boolean {
    return this._isGDE;
  }
}
