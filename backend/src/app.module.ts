import { Module } from '@nestjs/common';
import { InfraModule } from './infra/_infra.module';
import { PresentationModule } from './presentation/_presentation.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PresentationModule,
    InfraModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10
        }
      ]
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
