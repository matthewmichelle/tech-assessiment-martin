import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findAll(page?: number, limit?: number): Promise<Job[]>;
    findOne(id: string): Promise<Job>;
    create(createJobDto: CreateJobDto): Promise<Job>;
}
