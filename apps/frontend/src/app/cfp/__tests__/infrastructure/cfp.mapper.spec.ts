import { CfpMapper } from '../../infrastructure/http/cfp.mapper';
import { SpeakerApiDTO } from '../../infrastructure/http/cfp.dtos';
import { Speaker } from '../../domain/entities/speaker.entity';

describe('CfpMapper (Infrastructure)', () => {
  const mockDto: SpeakerApiDTO = {
    id: 'spk-123',
    nome: 'Maria Souza',
    email: 'maria@example.com',
    talkTitle: 'Signals na Prática',
    isGDE: false,
  };

  const mockEntity: Speaker = {
    id: 'spk-123',
    nome: 'Maria Souza',
    email: 'maria@example.com',
    talkTitle: 'Signals na Prática',
    isGDE: false,
  };

  it('deve mapear corretamente de DTO para Domínio (toDomain)', () => {
    const domain = CfpMapper.toDomain(mockDto);
    expect(domain).toEqual(mockEntity);
  });

  it('deve mapear corretamente de Domínio para DTO (toDTO)', () => {
    const dto = CfpMapper.toDTO(mockEntity);
    expect(dto).toEqual(mockDto);
  });
});
