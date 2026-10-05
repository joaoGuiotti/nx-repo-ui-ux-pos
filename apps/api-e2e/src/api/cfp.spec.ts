import axios, { AxiosError } from 'axios';

describe('CFP API (E2E)', () => {
  const uniqueId = `speaker-e2e-${Date.now()}`;
  const validSpeaker = {
    id: uniqueId,
    nome: 'Margaret Hamilton',
    email: 'margaret.hamilton@apollo.org',
    talkTitle: 'Software Engineering for Mission Critical Systems',
    isGDE: true,
  };

  describe('POST /api/cfp', () => {
    it('should create a speaker proposal successfully and return 201 Created', async () => {
      const response = await axios.post('/api/cfp', validSpeaker);

      expect(response.status).toBe(201);
      expect(response.data).toEqual(expect.objectContaining({
        id: uniqueId,
        nome: validSpeaker.nome,
        email: validSpeaker.email,
        talkTitle: validSpeaker.talkTitle,
        isGDE: true,
      }));
    });

    it('should reject payload with 400 Bad Request when email format is invalid', async () => {
      const invalidPayload = {
        id: `invalid-email-${Date.now()}`,
        nome: 'John Doe',
        email: 'not-a-valid-email',
        talkTitle: 'Testing Invalid Email',
        isGDE: false,
      };

      try {
        await axios.post('/api/cfp', invalidPayload);
        throw new Error('Expected request to fail with 400');
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string | string[]; statusCode: number }>;
        expect(error.response).toBeDefined();
        expect(error.response?.status).toBe(400);
        const messages = Array.isArray(error.response?.data.message)
          ? error.response?.data.message.join(' ')
          : error.response?.data.message;
        expect(messages).toContain('email must be an email');
      }
    });

    it('should reject payload with 400 Bad Request when required field nome is empty', async () => {
      const invalidPayload = {
        id: `invalid-nome-${Date.now()}`,
        nome: '',
        email: 'valid@domain.com',
        talkTitle: 'Testing Empty Name',
        isGDE: false,
      };

      try {
        await axios.post('/api/cfp', invalidPayload);
        throw new Error('Expected request to fail with 400');
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string | string[]; statusCode: number }>;
        expect(error.response).toBeDefined();
        expect(error.response?.status).toBe(400);
        const messages = Array.isArray(error.response?.data.message)
          ? error.response?.data.message.join(' ')
          : error.response?.data.message;
        expect(messages).toContain('nome should not be empty');
      }
    });

    it('should reject payload with 400 Bad Request when isGDE is not a boolean', async () => {
      const invalidPayload = {
        id: `invalid-gde-${Date.now()}`,
        nome: 'Valid Name',
        email: 'valid.gde@domain.com',
        talkTitle: 'Testing GDE Type',
        isGDE: 'not-a-boolean',
      };

      try {
        await axios.post('/api/cfp', invalidPayload);
        throw new Error('Expected request to fail with 400');
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string | string[]; statusCode: number }>;
        expect(error.response).toBeDefined();
        expect(error.response?.status).toBe(400);
      }
    });
  });

  describe('GET /api/cfp', () => {
    it('should list all submissions including the previously created proposal with 200 OK', async () => {
      const response = await axios.get('/api/cfp');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: uniqueId,
            nome: validSpeaker.nome,
            email: validSpeaker.email,
          }),
        ])
      );
    });
  });
});
