import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  toTransactionDto,
  TransactionDto,
  TransactionResponseDto,
  TransactionUuidParamDto
} from '../dtos/transaction.dto';
import { TransactionTypeEnum } from 'src/domain/enums/transaction-type.enum';
import { ICreateTransactionUseCase } from 'src/domain/interfaces/usecases/transaction/create-transaction.usecase.interface';
import { IListTransactionUseCase } from 'src/domain/interfaces/usecases/transaction/list-transaction.usecase';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: ICreateTransactionUseCase,

    @Inject('ListTransactionUseCase')
    private readonly listTransactionUseCase: IListTransactionUseCase
  ) {}

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Post('/deposit/:client_id')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(200)
  @ApiOperation({
    summary: 'Add balance to client account',
    description: 'Increases the balance of a specific client by a given amount.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async deposit(
    @Req() req: Request,
    @Param() params: TransactionUuidParamDto,
    @Body() body: TransactionDto
  ): Promise<TransactionResponseDto> {
    const possibleIp = req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const transaction = await this.createTransactionUseCase.execute({
      client_id: params.client_id,
      value: body.value,
      type: TransactionTypeEnum.DEPOSIT,
      description: `${userAgent} | ip:${possibleIp || '****'}`
    });

    return toTransactionDto(transaction);
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Post('/withdrawal/:client_id')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @ApiOperation({
    summary: 'Subtract balance from client account',
    description: 'Decreases the balance of a specific client by a given amount.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async withdrawal(
    @Req() req: Request,
    @Param() params: TransactionUuidParamDto,
    @Body() body: TransactionDto
  ): Promise<TransactionResponseDto> {
    const possibleIp = req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const transaction = await this.createTransactionUseCase.execute({
      client_id: params.client_id,
      value: body.value,
      type: TransactionTypeEnum.WITHDRAWAL,
      description: `${userAgent} | ip:${possibleIp || '****'}`
    });

    return toTransactionDto(transaction);
  }

  /**
   * @UseGuards
   * Authentication is mandatory. However, implementing a full system for creating, listing,
   * and deleting users would introduce significant complexity. Therefore, it is recommended
   * to prioritize alternatives such as SSO (Single Sign-On).
   */
  @Get('/:client_id')
  @ApiOperation({
    summary: 'Get client transactions',
    description: 'This endpoint get transactions of a specific client.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async listTransactions(
    @Param() params: TransactionUuidParamDto
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.listTransactionUseCase.execute(
      params.client_id
    );

    return transactions.map(toTransactionDto);
  }
}
