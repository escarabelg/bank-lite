import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import {
  CreateClientRequestDto,
  UpdateClientRequestDto
} from '../../dtos/client.dto';

describe('ClientController', () => {
  let controller: ClientController;

  const mockClient = {
    id: '66fbf838-0939-494a-b361-cb97f0a15551',
    name: 'User user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const createClientUseCase = {
    execute: jest.fn().mockResolvedValue(mockClient)
  };

  const deleteClientUseCase = {
    execute: jest.fn().mockResolvedValue(undefined)
  };

  const getClientUseCase = {
    execute: jest.fn().mockResolvedValue(mockClient)
  };

  const updateClientUseCase = {
    execute: jest.fn().mockResolvedValue(mockClient)
  };

  const listClientUseCase = {
    execute: jest.fn().mockResolvedValue([mockClient])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        { provide: 'CreateClientUseCase', useValue: createClientUseCase },
        { provide: 'DeleteClientUseCase', useValue: deleteClientUseCase },
        { provide: 'GetClientUseCase', useValue: getClientUseCase },
        { provide: 'UpdateClientUseCase', useValue: updateClientUseCase },
        { provide: 'ListClientUseCase', useValue: listClientUseCase }
      ]
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should create a client', async () => {
    const dto: CreateClientRequestDto = {
      name: 'User user',
      email: 'user@user.com'
    };
    const result = await controller.create(dto);

    expect(result.name).toBe('User user');
    expect(createClientUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should list all clients', async () => {
    const result = await controller.listAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe(mockClient.id);
    expect(listClientUseCase.execute).toHaveBeenCalled();
  });

  it('should get a client by ID', async () => {
    const param = { client_id: mockClient.id };
    const result = await controller.get(param);

    expect(result.id).toBe(mockClient.id);
    expect(getClientUseCase.execute).toHaveBeenCalledWith(mockClient.id);
  });

  it('should update a client', async () => {
    const param = { client_id: mockClient.id };
    const body: UpdateClientRequestDto = { name: 'Updated Name' };

    const result = await controller.update(param, body);

    expect(result.name).toBe(mockClient.name);
    expect(updateClientUseCase.execute).toHaveBeenCalledWith({
      data: { name: body.name },
      where: { id: param.client_id }
    });
  });

  it('should delete a client', async () => {
    const param = { client_id: mockClient.id };

    await controller.delete(param);

    expect(deleteClientUseCase.execute).toHaveBeenCalledWith(mockClient.id);
  });
});
