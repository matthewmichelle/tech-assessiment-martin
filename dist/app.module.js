"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jobs_module_1 = require("./jobs/jobs.module");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const database_module_1 = require("./database.module");
const app_controller_1 = require("./app.controller");
const throttler_1 = require("@nestjs/throttler");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const correlator = require("express-correlation-id");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(correlator()).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            nestjs_redis_1.RedisModule.forRoot({
                config: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                    password: process.env.REDIS_PASSWORD || undefined,
                },
            }),
            nestjs_prometheus_1.PrometheusModule.register({
                defaultMetrics: {
                    enabled: true,
                    config: {},
                },
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.default] }),
            jobs_module_1.JobsModule,
        ],
        exports: [config_1.ConfigModule.forRoot({ isGlobal: true, load: [configuration_1.default] })],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map