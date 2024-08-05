import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import { RedisService } from '@liaoliaots/nestjs-redis';
export declare class JobsService {
    private jobRepository;
    private redisService;
    private readonly redisClient;
    constructor(jobRepository: Repository<Job>, redisService: RedisService);
    findAll(page: number, limit: number): Promise<Job[]>;
    findOne(id: number): Promise<Job>;
    create(createJobDto: CreateJobDto): Promise<Job>;
    scheduleJob(job: Job): void;
    executeJob(job: Job): void;
    parseInterval(interval: string): number;
}
