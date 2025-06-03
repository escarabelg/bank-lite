import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsDecimal,
  Min
} from 'class-validator';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { IsGreaterThan } from 'src/presentation/validators/is-greater-than.decorator';

export class TransactionUuidParamDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;
}

export class TransactionDto {
  @IsDecimal()
  @IsGreaterThan(0.01, { message: 'Transaction must be greater than 0.01' })
  @IsNotEmpty()
  value: string;
}

export class TransactionResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  before: string;

  @IsString()
  @IsNotEmpty()
  after: string;

  @IsDateString()
  @IsNotEmpty()
  created_at: string;

  @IsDateString()
  @IsNotEmpty()
  updated_at: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export const toTransactionDto = (
  transaction: TransactionEntity
): TransactionResponseDto => ({
  id: transaction.id,
  client_id: transaction.client_id,
  after: transaction.after.toString(),
  before: transaction.before.toString(),
  value: transaction.value.toString(),
  type: transaction.type.valueOf(),
  created_at: transaction.created_at,
  updated_at: transaction.updated_at,
  description: transaction?.description
});
