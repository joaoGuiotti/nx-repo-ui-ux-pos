import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../../../app.module';

describe('CfpController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/cfp - should create a speaker proposal and return 201 Created', async () => {
    const payload = {
      id: 'speaker-e2e-1',
      nome: 'Ada Lovelace',
      email: 'ada@example.com',
      talkTitle: 'First Computer Algorithm',
      isGDE: true,
    };

    const response = await request(app.getHttpServer())
      .post('/api/cfp')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual(payload);
  });

  it('POST /api/cfp - should return 400 Bad Request when DTO validation fails (invalid email)', async () => {
    const payload = {
      id: 'speaker-e2e-2',
      nome: 'Alan Turing',
      email: 'invalid-email-format',
      talkTitle: 'Enigma Code',
      isGDE: false,
    };

    const response = await request(app.getHttpServer())
      .post('/api/cfp')
      .send(payload)
      .expect(400);

    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('email must be an email')])
    );
  });

  it('GET /api/cfp - should return all created proposals with 200 OK', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/cfp')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
