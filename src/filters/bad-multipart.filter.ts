/*
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpAdapterHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Catch(Error)
export class BadMultipartFilter implements ExceptionFilter {
    constructor(
        public reflector: Reflector,
    ) {}

    catch(exception: Error, host: ArgumentsHost): void {

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
*/
