import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post
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

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: ICreateTransactionUseCase,

    @Inject('ListTransactionUseCase')
    private readonly listTransactionUseCase: IListTransactionUseCase
  ) {}

  @Post('/deposit/:client_id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Add balance to client account',
    description: 'Increases the balance of a specific client by a given amount.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async deposit(
    @Param() params: TransactionUuidParamDto,
    @Body() body: TransactionDto
  ): Promise<TransactionResponseDto> {
    const transaction = await this.createTransactionUseCase.execute({
      client_id: params.client_id,
      value: body.value,
      type: TransactionTypeEnum.DEPOSIT
    });

    return toTransactionDto(transaction);
  }

  @Post('/withdrawal/:client_id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Subtract balance from client account',
    description: 'Decreases the balance of a specific client by a given amount.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found'
  })
  async withdrawal(
    @Param() params: TransactionUuidParamDto,
    @Body() body: TransactionDto
  ): Promise<TransactionResponseDto> {
    const transaction = await this.createTransactionUseCase.execute({
      client_id: params.client_id,
      value: body.value,
      type: TransactionTypeEnum.WITHDRAWAL
    });

    return toTransactionDto(transaction);
  }

  @Get('/:client_id')
  @ApiOperation({
    summary: 'Get client transactions',
    description: 'This endpoint get transactions of a specific client.'
  })
  @ApiNotFoundResponse({
    description: 'Client not found!'
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
