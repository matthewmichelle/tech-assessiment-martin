"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("./entities/job.entity");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const cron_1 = require("cron");
let JobsService = class JobsService {
    constructor(jobRepository, redisService) {
        this.jobRepository = jobRepository;
        this.redisService = redisService;
        this.redisClient = redisService.getClient();
    }
    async findAll(page, limit) {
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
    findOne(id) {
        return this.jobRepository.findOneBy({ id });
    }
    async create(createJobDto) {
        const job = this.jobRepository.create(createJobDto);
        const savedJob = await this.jobRepository.save(job);
        this.scheduleJob(savedJob);
        return savedJob;
    }
    scheduleJob(job) {
        const jobInstance = new cron_1.CronJob('*/30 * * * *', () => {
            this.executeJob(job);
        });
        jobInstance.start();
    }
    executeJob(job) {
        console.log(`Executing job: ${job.name}`);
        job.lastRun = new Date();
        job.nextRun = new Date(Date.now() + this.parseInterval(job.interval));
        this.jobRepository.save(job);
    }
    parseInterval(interval) {
        return parseInt(interval, 10);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nestjs_redis_1.RedisService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map