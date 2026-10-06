import { Module } from '@nestjs/common';
import { CreateSpeakerUseCase } from './application/use-cases/create-speaker.use-case';
import { FindAllSpeakersUseCase } from './application/use-cases/find-all-speakers.use-case';
import { CfpRepository } from './domain/ports/cfp.repository';
import { CfpInMemoryAdapter } from './infrastructure/adapters/cfp-in-memory.adapter';
import { CfpController } from './presentation/controllers/cfp.controller';

@Module({
  controllers: [CfpController],
  providers: [
    CreateSpeakerUseCase,
    FindAllSpeakersUseCase,
    {
      provide: CfpRepository,
      useClass: CfpInMemoryAdapter,
    },
  ],
  exports: [CreateSpeakerUseCase, FindAllSpeakersUseCase, CfpRepository],
})
export class CfpModule {}
