/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as correlator from 'express-correlation-id';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const correlationId = correlator.getId();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[${method}] ${url} - Processed in ${
            Date.now() - now
          }ms - correlationId: ${correlationId}`,
        );
      }),
    );
  }
}
