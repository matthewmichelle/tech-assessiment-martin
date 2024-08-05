// src/jobs/job.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { CronJob } from 'cron';

/**
 * Service for managing jobs.
 * Integrates with TypeORM for database operations and Redis for caching.
 * Also utilizes the CronJob library for scheduling job execution.
 */
@Injectable()
export class JobsService {
  private readonly redisClient: Redis;

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  /**
   * Retrieves a paginated list of jobs from the database.
   * If the result is cached, it retrieves the data from Redis instead.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of jobs per page.
   * @returns A promise that resolves to an array of Job objects.
   */
  async findAll(page: number, limit: number): Promise<Job[]> {
    const cacheKey = `jobs:${page}:${limit}`;
    const cachedJobs = await this.redisClient.get(cacheKey);
    console.log('cached jobs', cachedJobs);
    if (cachedJobs) {
      return JSON.parse(cachedJobs);
    }

    const [result, total] = await this.jobRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 60);
    return result;
  }

  /**
   * Retrieves a single job by its ID from the database.
   *
   * @param id - The ID of the job to retrieve.
   * @returns A promise that resolves to a Job object.
   */
  findOne(id: number): Promise<Job> {
    return this.jobRepository.findOneBy({ id });
  }

  /**
   * Creates a new job in the database and schedules it for execution.
   *
   * @param createJobDto - The data for creating the new job.
   * @returns A promise that resolves to the newly created Job object.
   */
  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(createJobDto);
    const savedJob = await this.jobRepository.save(job);
    this.scheduleJob(savedJob);
    return savedJob;
  }

  /**
   * Schedules a job for execution using the CronJob library.
   *
   * @param job - The job to schedule.
   */
  scheduleJob(job: Job) {
    const jobInstance = new CronJob(job.interval.toString(), () => {
      this.executeJob(job);
    });

    jobInstance.start();
  }

  /**
   * Executes a job by logging its name and updating its last run and next run timestamps.
   *
   * @param job - The job to execute.
   */
  executeJob(job: Job) {
    // Placeholder for job execution logic
    console.log(`Executing job: ${job.name}`);
    job.lastRun = new Date();
    job.nextRun = new Date(Date.now() + this.parseInterval(job.interval));
    this.jobRepository.save(job);
  }

  /**
   * Parses an interval string and converts it to milliseconds.
   * If the interval is not a cron expression, it assumes it's a number representing milliseconds.
   *
   * @param interval - The interval string to parse.
   * @returns The interval in milliseconds.
   */
  parseInterval(interval: string): number {
    // Convert interval to milliseconds if it's not a cron expression
    // This is a simplified example
    return parseInt(interval, 10);
  }
}
