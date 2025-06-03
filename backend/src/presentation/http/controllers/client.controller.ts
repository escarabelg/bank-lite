import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { ICreateClientUseCase } from 'src/domain/interfaces/usecases/client/create-client.usecase.interface';
import { IDeleteClientUseCase } from 'src/domain/interfaces/usecases/client/delete-client.usecase.interface';
import { IGetClientUseCase } from 'src/domain/interfaces/usecases/client/get-client.usecase.interface';
import { IListClientUseCase } from 'src/domain/interfaces/usecases/client/list-client.usecase.interface';
import { IUpdateClientUseCase } from 'src/domain/interfaces/usecases/client/update-client.usecase.interface';
import {
  ClientResponseDto,
  toClientResponseDto,
  ClientUuidParamDto,
  CreateClientRequestDto,
  UpdateClientRequestDto
} from '../dtos/client.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(
    @Inject('CreateClientUseCase')
    private readonly createClientUseCase: ICreateClientUseCase,

    @Inject('DeleteClientUseCase')
    private readonly deleteClientUseCase: IDeleteClientUseCase,

    @Inject('GetClientUseCase')
    private readonly getClientUseCase: IGetClientUseCase,

    @Inject('UpdateClientUseCase')
    private readonly updateClientUseCase: IUpdateClientUseCase,

    @Inject('ListClientUseCase')
    private readonly listClientUseCase: IListClientUseCase
  ) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new Client',
    description: 'This endpoint create a new client.'
  })
  @ApiBody({
    type: CreateClientRequestDto,
    description: 'Create a new client'
  })
  @ApiBadRequestResponse({
    description: 'Client already exists'
  })
  async create(
    @Body() params: CreateClientRequestDto
  ): Promise<ClientResponseDto> {
    const client = await this.createClientUseCase.execute(params);
    return toClientResponseDto(client);
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all clients',
    description: 'This endpoint list all clients.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async listAll(): Promise<ClientResponseDto[]> {
    const clients = await this.listClientUseCase.execute();
    return clients.map(toClientResponseDto);
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Get('/:client_id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a specific client',
    description: 'This endpoint get a specific client.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async get(@Param() param: ClientUuidParamDto): Promise<ClientResponseDto> {
    const client = await this.getClientUseCase.execute(param.client_id);
    return toClientResponseDto(client);
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Put('/:client_id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update client',
    description: 'This endpoint update a exists client by id.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async update(
    @Param() param: ClientUuidParamDto,
    @Body() body: UpdateClientRequestDto
  ): Promise<ClientResponseDto> {
    const client = await this.updateClientUseCase.execute({
      data: {
        name: body.name
      },
      where: {
        id: param.client_id
      }
    });
    return client;
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Delete('/:client_id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete client',
    description: 'This endpoint delete a exists client by id.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async delete(@Param() param: ClientUuidParamDto): Promise<void> {
    await this.deleteClientUseCase.execute(param.client_id);
  }
}
