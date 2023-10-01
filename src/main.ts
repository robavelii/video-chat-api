import {
    ClassSerializerInterceptor,
    HttpStatus,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import bodyParser from 'body-parser';
// import RateLimit from 'express-rate-limit';
import morgan from 'morgan';
import * as requestIp from 'request-ip';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );
    app.enable('trust proxy');
    app.use(requestIp.mw());

    const reflector = app.get(Reflector);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
        new AllExceptionsFilter(httpAdapter),
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: true,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(errors),
        }),
    );

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    void app.startAllMicroservices();

    // if (['development', 'staging'].includes(configService.nodeEnv)) {
    app.use(morgan('combined'));
    setupSwagger(app);
    // }

    app.use(
        '/api/payment/webhook',
        bodyParser.raw({ type: 'application/json' }),
    );

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`Server running on port ${port}`);

    return app;
}

void bootstrap();
