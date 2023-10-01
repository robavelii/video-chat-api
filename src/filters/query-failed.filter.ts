import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { queryFailedCodes } from './query-failed-codes';
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let code = 500;
        let message = 'Error';
        let detail = null;

        if (exception.code && queryFailedCodes[exception.code]) {
            code = queryFailedCodes[exception.code].code;
            message = queryFailedCodes[exception.code].message;

            if (code === 409) {
                detail = exception.detail;
            }
        }

        response.status(code).json({
            message,
            statusCode: code,
            error: STATUS_CODES[code],
            detail: detail ?? undefined,
        });
    }
}
