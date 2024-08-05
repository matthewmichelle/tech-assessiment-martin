import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as correlator from 'express-correlation-id';
import { RabbitMQModule } from './consumer/rabbitmq.module';

@Module({
  imports: [
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    // RabbitMQModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
        config: {},
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JobsModule,
  ],
  exports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  /**
   * Configures middleware for the application.
   *
   * @param {MiddlewareConsumer} consumer - The consumer to which middleware will be applied.
   *
   * This method sets up various middleware for the application, including:
   * - `correlator`: Middleware for generating and managing correlation IDs.
   *
   * The middleware is applied to all routes ('*').
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(correlator()).forRoutes('*');
  }
}