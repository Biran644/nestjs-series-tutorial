import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyLoggerService } from './my-logger/my-logger.service';
import { Response, Request } from 'express';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseBody: MyResponseObject = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      responseBody.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      responseBody.statusCode = HttpStatus.BAD_REQUEST;
      responseBody.response = exception.message.replaceAll('\n', ' ');
    } else {
      responseBody.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody.response = 'Internal server error';
    }

    response.status(responseBody.statusCode).json(responseBody);

    this.logger.error(responseBody.response, AllExceptionsFilter.name);
    super.catch(exception, host);
  }
}
