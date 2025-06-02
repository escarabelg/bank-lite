import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected to the database.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected from the database.');
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async () => {
      console.log('Prisma disconnecting gracefully.');
      await app.close();
    });
  }
}
