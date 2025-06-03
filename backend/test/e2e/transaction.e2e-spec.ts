import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing/test';
import { PrismaService } from 'src/infra/database/prisma/prisma.service.client';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

let app: INestApplication;
let testingModule: TestingModule;
let prismaService: PrismaService;

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  prismaService = new PrismaService();

  app = testingModule.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
});

afterAll(async () => {
  await prismaService.$disconnect();
  await app.close();
});

beforeEach(async () => {
  await prismaService.client.deleteMany();
  await prismaService.transaction.deleteMany();
});

afterEach(async () => {
  await prismaService.client.deleteMany();
  await prismaService.transaction.deleteMany();
});

const mockClient = {
  name: 'User user',
  email: 'user@user.com'
};

describe('[e2e] TransactionController', () => {
  it('(POST) transaction/deposit/', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const response = await request(app.getHttpServer())
      .post(`/transaction/deposit/${client.body.id}`)
      .send({
        value: '10'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        client_id: client.body.id,
        after: '10',
        before: '0',
        type: 'DEPOSIT',
        value: '10',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        description: null
      })
    );
  });

  it('(POST) transaction/deposit/ - client not found', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/deposit/66fbf838-0939-494a-b361-cb97f0a15552')
      .send({
        value: '10'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Client not found',
      statusCode: 404
    });
  });

  it('(POST) transaction/withdrawal/', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const client_id = client.body.id;
    await request(app.getHttpServer())
      .post(`/transaction/deposit/${client_id}`)
      .send({
        value: '10'
      });

    const response = await request(app.getHttpServer())
      .post(`/transaction/withdrawal/${client_id}`)
      .send({
        value: '5'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        client_id,
        after: '5',
        before: '10',
        type: 'WITHDRAWAL',
        value: '5',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        description: null
      })
    );
  });

  it('(POST) transaction/withdrawal/ - client without balance', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const client_id = client.body.id;

    const response = await request(app.getHttpServer())
      .post(`/transaction/withdrawal/${client_id}`)
      .send({
        value: '10'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: 'Insufficient funds',
      statusCode: 400
    });
  });

  it('(POST) transaction/withdrawal/ - client not found', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction/withdrawal/66fbf838-0939-494a-b361-cb97f0a15552')
      .send({
        value: '10'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Client not found',
      statusCode: 404
    });
  });

  it('(GET) transaction/:client_id', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const client_id = client.body.id;

    await request(app.getHttpServer())
      .post(`/transaction/deposit/${client_id}`)
      .send({
        value: '3'
      });

    await request(app.getHttpServer())
      .post(`/transaction/withdrawal/${client_id}`)
      .send({
        value: '2'
      });

    const response = await request(app.getHttpServer()).get(
      `/transaction/${client_id}`
    );

    expect(response.status).toBe(200);

    expect(response.body[0]).toEqual(
      expect.objectContaining({
        client_id,
        type: 'DEPOSIT',
        value: '3',
        after: '3',
        before: '0',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        description: null
      })
    );
    expect(response.body[1]).toEqual(
      expect.objectContaining({
        client_id,
        type: 'WITHDRAWAL',
        value: '2',
        after: '1',
        before: '3',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        id: expect.any(String),
        description: null
      })
    );
  });
});
