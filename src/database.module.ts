/**
 * DatabaseModule is a NestJS module that configures and provides database connectivity using TypeORM.
 * It sets up the connection to a PostgreSQL database using environment variables for configuration.
 *
 * @module DatabaseModule
 * @category Modules
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports: [
    /**
     * Configures TypeORM to connect to the database asynchronously.
     * The configuration is fetched from environment variables using the ConfigService.
     *
     * @function forRootAsync
     * @memberof TypeOrmModule
     * @param {ConfigService} configService - The ConfigService instance to fetch environment variables.
     * @returns {Promise<TypeOrmModuleOptions>} - A promise that resolves to the TypeORM module options.
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Job],
        synchronize: true,
      }),
    }),

    /**
     * Registers the Job entity for use with TypeORM.
     *
     * @function forFeature
     * @memberof TypeOrmModule
     * @param {typeof Job} - The Job entity class.
     * @returns {DynamicModule} - A dynamic module that includes the provided entity.
     */
    TypeOrmModule.forFeature([Job]),
  ],
})
export class DatabaseModule extends TypeOrmModule {}
