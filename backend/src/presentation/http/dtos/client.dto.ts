import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID
} from 'class-validator';
import { ClientEntity } from 'src/domain/entities/client.entity';

export class ClientUuidParamDto {
  @IsUUID()
  @IsNotEmpty()
  client_id: string;
}

export class CreateClientRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateClientRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ClientResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @IsDateString()
  @IsNotEmpty()
  created_at: string;

  @IsDateString()
  @IsNotEmpty()
  updated_at: string;
}

export const toClientResponseDto = (
  client: ClientEntity
): ClientResponseDto => ({
  id: client.id,
  email: client.email,
  is_active: client.is_active,
  name: client.name,
  created_at: client.created_at,
  updated_at: client.updated_at
});
