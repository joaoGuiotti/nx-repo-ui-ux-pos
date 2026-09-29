import { Speaker } from '../../domain/entities/speaker.entity';

describe('Speaker Entity (Domain)', () => {
  it('deve instanciar uma entidade de Speaker válida com todas as propriedades', () => {
    const speaker: Speaker = {
      id: 'spk-1',
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      talkTitle: 'Clean Architecture no Angular',
      isGDE: true,
    };

    expect(speaker.id).toBe('spk-1');
    expect(speaker.nome).toBe('João Silva');
    expect(speaker.email).toBe('joao.silva@example.com');
    expect(speaker.talkTitle).toBe('Clean Architecture no Angular');
    expect(speaker.isGDE).toBe(true);
  });
});
