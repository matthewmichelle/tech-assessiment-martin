"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const custom_error_filter_1 = require("./custom-error.filter");
const correlator = require("express-correlation-id");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        if (exception instanceof custom_error_filter_1.ApplicationErrors) {
            const applicationException = exception;
            response.status(status).json({
                message: exception.message,
                stack: exception.stack,
                timestamp: new Date().toISOString(),
                path: request.url,
                code: status,
            });
        }
        else if (exception instanceof common_1.BadRequestException) {
            const exceptionResponse = exception.getResponse();
            let validationMessages = [];
            if (typeof exceptionResponse === 'object' &&
                'message' in exceptionResponse) {
                validationMessages = Array.isArray(exceptionResponse.message)
                    ? exceptionResponse.message
                    : [exceptionResponse.message];
            }
            response.status(status).json({
                message: validationMessages,
                stack: exception.stack,
                code: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
        else {
            response.status(status).json({
                message: exception.message,
                stack: exception.stack,
                code: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
        const formattedException = JSON.stringify(exception);
        const correlationId = correlator.getId();
        this.logger.error(`An error occurred (correlationId: ${correlationId}):\nException Details:\n${formattedException}`);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map