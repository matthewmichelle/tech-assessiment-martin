import { Module } from '@nestjs/common';
import { RabbitmqConsumerService } from './rabbitmq-consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobsService } from 'src/jobs/jobs.service';
import { DatabaseModule } from 'src/database.module';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([Job]),
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule globally available
    }),
    ClientsModule.registerAsync([
      {
        name: 'JOB_SCHEDULE_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [RabbitmqConsumerService, JobsService],
  exports: [RabbitmqConsumerService],
})
export class RabbitmqModule {}
