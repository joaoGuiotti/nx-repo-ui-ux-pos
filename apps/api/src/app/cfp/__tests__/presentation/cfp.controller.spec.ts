import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CfpController } from '../../cfp.controller';
import { CfpService } from '../../cfp.service';
import { CreateSpeakerDto } from '../../dto/create-speaker.dto';

describe('CfpController', () => {
  let controller: CfpController;
  let service: CfpService;
  let pipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CfpController],
      providers: [CfpService],
    }).compile();

    controller = module.get<CfpController>(CfpController);
    service = module.get<CfpService>(CfpService);
    pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create - controller execution', () => {
    it('should receive a valid payload and return the created speaker', () => {
      const dto: CreateSpeakerDto = {
        id: 'speaker-1',
        nome: 'Ada Lovelace',
        email: 'ada@example.com',
        talkTitle: 'The First Algorithm',
        isGDE: true,
      };

      const result = controller.create(dto);

      expect(result).toEqual(dto);
      expect(service.findAll()).toContainEqual(dto);
    });
  });

  describe('ValidationPipe - payload validation', () => {
    const metadata = {
      type: 'body' as const,
      metatype: CreateSpeakerDto,
      data: '',
    };

    it('should validate and transform a valid payload successfully', async () => {
      const validPayload = {
        id: 'speaker-2',
        nome: 'Alan Turing',
        email: 'alan@example.com',
        talkTitle: 'Enigma and Computation',
        isGDE: false,
      };

      const transformed = await pipe.transform(validPayload, metadata);

      expect(transformed).toBeInstanceOf(CreateSpeakerDto);
      expect(transformed.nome).toBe('Alan Turing');
      expect(transformed.email).toBe('alan@example.com');
    });

    it('should reject with 400 Bad Request when email is invalid', async () => {
      const invalidEmailPayload = {
        id: 'speaker-3',
        nome: 'Grace Hopper',
        email: 'invalid-email-format',
        talkTitle: 'Compilers Architecture',
        isGDE: true,
      };

      await expect(pipe.transform(invalidEmailPayload, metadata)).rejects.toThrow(
        BadRequestException
      );

      try {
        await pipe.transform(invalidEmailPayload, metadata);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        const response = error.getResponse();
        expect(response.message).toEqual(
          expect.arrayContaining([expect.stringContaining('email must be an email')])
        );
      }
    });

    it('should reject with 400 Bad Request when nome is empty or missing', async () => {
      const emptyNamePayload = {
        id: 'speaker-4',
        nome: '',
        email: 'grace@example.com',
        talkTitle: 'Compilers Architecture',
        isGDE: true,
      };

      await expect(pipe.transform(emptyNamePayload, metadata)).rejects.toThrow(
        BadRequestException
      );

      try {
        await pipe.transform(emptyNamePayload, metadata);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        const response = error.getResponse();
        expect(response.message).toEqual(
          expect.arrayContaining([expect.stringContaining('nome should not be empty')])
        );
      }
    });

    it('should reject with 400 Bad Request when isGDE is not a boolean', async () => {
      const invalidGdePayload = {
        id: 'speaker-5',
        nome: 'Linus Torvalds',
        email: 'linus@example.com',
        talkTitle: 'Linux Kernel Development',
        isGDE: 'yes',
      };

      await expect(pipe.transform(invalidGdePayload, metadata)).rejects.toThrow(
        BadRequestException
      );

      try {
        await pipe.transform(invalidGdePayload, metadata);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should reject with 400 Bad Request when extra non-whitelisted fields are provided', async () => {
      const extraFieldsPayload = {
        id: 'speaker-6',
        nome: 'Margaret Hamilton',
        email: 'margaret@example.com',
        talkTitle: 'Apollo Guidance Computer',
        isGDE: false,
        maliciousField: 'hack',
      };

      await expect(pipe.transform(extraFieldsPayload, metadata)).rejects.toThrow(
        BadRequestException
      );

      try {
        await pipe.transform(extraFieldsPayload, metadata);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
