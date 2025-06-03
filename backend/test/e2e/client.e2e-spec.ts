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
});

afterEach(async () => {
  await prismaService.client.deleteMany();
});

const mockClient = {
  name: 'User user',
  email: 'user@users.com'
};

describe('[e2e] ClientController', () => {
  it('(POST) client/', async () => {
    const response = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: mockClient.name,
        email: mockClient.email,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        is_active: true,
        id: expect.any(String)
      })
    );
  });

  it('(POST) client/ - invalid data', async () => {
    const response = await request(app.getHttpServer()).post('/client').send({
      name: 'teste'
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: ['email should not be empty', 'email must be a string'],
      statusCode: 400
    });
  });

  it('(GET) client/:client_id', async () => {
    const createresponse = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const getresponse = await request(app.getHttpServer()).get(
      `/client/${createresponse.body.id}`
    );

    expect(getresponse.status).toBe(200);
    expect(getresponse.body).toEqual(
      expect.objectContaining({
        name: mockClient.name,
        email: mockClient.email,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        is_active: true
      })
    );
  });
  it('(GET) client/:client_id - not found', async () => {
    const get = await request(app.getHttpServer()).get(
      `/client/66fbf838-0939-494a-b361-cb97f0a15552`
    );

    expect(get.status).toBe(404);
    expect(get.body).toEqual({
      error: 'Not Found',
      message: 'Client not found',
      statusCode: 404
    });
  });
  it('(PUT) client/:client_id', async () => {
    const createresponse = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const updateresponse = await request(app.getHttpServer())
      .put(`/client/${createresponse.body.id}`)
      .send({
        name: mockClient.name,
        email: mockClient.email
      });

    expect(updateresponse.status).toBe(200);
    expect(updateresponse.body).toEqual({
      id: createresponse.body.id,
      name: mockClient.name,
      email: mockClient.email,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      is_active: true
    });
  });
  it('(PUT) client/:client_id - invalid data', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const updateresponse = await request(app.getHttpServer())
      .put(`/client/${client.body.id}`)
      .send({
        named: 'teste'
      });

    expect(updateresponse.status).toBe(400);
    expect(updateresponse.body).toEqual({
      error: 'Bad Request',
      message: ['name should not be empty', 'name must be a string'],
      statusCode: 400
    });
  });
  it('(PUT) client/:client_id - not found', async () => {
    const updateresponse = await request(app.getHttpServer())
      .put(`/client/66fbf838-0939-494a-b361-cb97f0a15552`)
      .send(mockClient);

    expect(updateresponse.status).toBe(404);
    expect(updateresponse.body).toEqual({
      error: 'Not Found',
      message: 'Client not found',
      statusCode: 404
    });
  });
  it('(DELETE) client/:client_id', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(mockClient);

    const response = await request(app.getHttpServer())
      .delete(`/client/${client.body.id}`)
      .send(mockClient);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
  it('(DELETE) client/:client_id - not found', async () => {
    const response = await request(app.getHttpServer())
      .put(`/client/66fbf838-0939-494a-b361-cb97f0a15552`)
      .send(mockClient);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Client not found',
      statusCode: 404
    });
  });
});
