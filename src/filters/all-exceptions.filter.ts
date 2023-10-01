import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if ((exception as any)?.message === 'Multipart: Boundary not found') {
            const error = new BadRequestException(
                'Multipart: Boundary not found',
            );
            response.status(error.getStatus()).json(error.getResponse());
        } else {
            super.catch(exception, host);
        }
    }
}
