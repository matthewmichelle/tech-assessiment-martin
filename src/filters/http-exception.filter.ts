/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationErrors } from './custom-error.filter';
import * as correlator from 'express-correlation-id';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Check if the caught exception is an instance of ApplicationErrors
    if (exception instanceof ApplicationErrors) {
      const applicationException = exception as ApplicationErrors; // Type assertion

      // Extract additional parameters from ApplicationErrors

      // You can add more properties here if needed

      // Send response with additional parameters
      response.status(status).json({
        message: exception.message,
        stack: exception.stack,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: status, // Include additional parameter
      });
    } else if (exception instanceof BadRequestException) {
      // Handle validation errors from BadRequestException
      const exceptionResponse = exception.getResponse() as
        | { message: string[] }
        | { message: string; error: string };

      let validationMessages: string[] = [];
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        validationMessages = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message];
      }

      // Send response with validation errors
      response.status(status).json({
        message: validationMessages,
        stack: exception.stack,
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      // If it's a regular HttpException, send response without additional parameters
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

    this.logger.error(
      `An error occurred (correlationId: ${correlationId}):\nException Details:\n${formattedException}`,
    );
  }
}
