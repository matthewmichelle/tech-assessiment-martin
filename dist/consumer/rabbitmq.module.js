"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqModule = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_consumer_service_1 = require("./rabbitmq-consumer.service");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const jobs_service_1 = require("../jobs/jobs.service");
const database_module_1 = require("../database.module");
const job_entity_1 = require("../jobs/entities/job.entity");
let RabbitmqModule = class RabbitmqModule {
};
exports.RabbitmqModule = RabbitmqModule;
exports.RabbitmqModule = RabbitmqModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature([job_entity_1.Job]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'JOB_SCHEDULE_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: async (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL')],
                            queue: configService.get('RABBITMQ_QUEUE'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                },
            ]),
        ],
        providers: [rabbitmq_consumer_service_1.RabbitmqConsumerService, jobs_service_1.JobsService],
        exports: [rabbitmq_consumer_service_1.RabbitmqConsumerService],
    })
], RabbitmqModule);
//# sourceMappingURL=rabbitmq.module.js.map