// src/jobs/dto/create-job.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    example: 'Email Notification',
    description: 'The name of the job',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2024-08-01T00:00:00.000Z',
    description: 'The last run timestamp of the job',
  })
  @IsDateString()
  lastRun: Date;

  @ApiProperty({
    example: '2024-08-02T00:00:00.000Z',
    description: 'The next run timestamp of the job',
  })
  @IsDateString()
  nextRun: Date;

  @ApiProperty({
    description: 'The interval at which the job should run',
    example: 'daily',
  })
  @IsString()
  @IsNotEmpty()
  interval: string;

  @ApiProperty({
    example: 'Send email notifications to users',
    description: 'The details of the job',
  })
  @IsString()
  details: string;
}
