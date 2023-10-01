import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';

import { ConfigService } from './services/config.service';
import { CronService } from './services/cron.service';

const providers = [ConfigService, CronService];

@Global()
@Module({
    providers,
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
        CacheModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                store: redisStore as any,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
            }),
            inject: [ConfigService],
        }),
        /*
        MulterModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const baseDir = path.resolve(configService.uploadDir);

                return {
                    storage: multer.diskStorage({
                        destination: baseDir,
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        filename: async (_req, file, callback) => {
                            const randomDir = Math.round(Math.random() * 100);
                            await fs.mkdirs(`${baseDir}/${randomDir}`);
                            const ext = path.extname(file.originalname);
                            callback(null, `${randomDir}/${uuidv4()}${ext}`);
                        },
                    }),
                };
            },
            inject: [ConfigService],
        }),
        */
    ],
    exports: [...providers, JwtModule, CacheModule],
})
export class SharedModule {}
