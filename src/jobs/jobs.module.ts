import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseModule } from 'src/database.module';
import { Job } from './entities/job.entity';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [DatabaseModule.forFeature([Job])],
})
export class JobsModule {}
