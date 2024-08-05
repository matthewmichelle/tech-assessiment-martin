import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { SerializationInterceptor } from 'src/filters/serialization-interceptor.filter';
import { LoggingInterceptor } from 'src/filters/logging.interceptor';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * Controller for managing job-related operations.
 *
 * @classdesc This class handles HTTP requests related to jobs.
 */
@ApiTags('jobs')
@Controller('jobs')
@UseInterceptors(SerializationInterceptor, LoggingInterceptor)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Retrieves a list of jobs.
   *
   * @param {number} page - The page number for pagination. Default is 1.
   * @param {number} limit - The number of jobs per page. Default is 10.
   * @returns {Promise<Job[]>} A promise that resolves to an array of Job objects.
   */
  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of jobs per page',
  })
  @ApiResponse({ status: 200, description: 'List of jobs', type: [Job] })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<Job[]> {
    return this.jobsService.findAll(page, limit);
  }

  /**
   * Retrieves a single job by its ID.
   *
   * @param {string} id - The ID of the job to retrieve.
   * @returns {Promise<Job>} A promise that resolves to a Job object.
   * @throws {NotFoundException} If the job is not found.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a job by ID' })
  @SkipThrottle()
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job details', type: Job })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id') id: string): Promise<Job> {
    return this.jobsService.findOne(+id);
  }

  /**
   * Creates a new job.
   *
   * @param {CreateJobDto} createJobDto - The data for creating a new job.
   * @returns {Promise<Job>} A promise that resolves to the created Job object.
   * @throws {BadRequestException} If the request data is invalid.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created', type: Job })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.jobsService.create(createJobDto);
  }
}
