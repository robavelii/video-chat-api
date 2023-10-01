import { BullRootModuleOptions } from '@nestjs/bull';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';

export class ConfigService {
    constructor() {
        const nodeEnv = this.nodeEnv;
        dotenv.config({
            path: `.${nodeEnv}.env`,
        });

        // Replace \\n with \n to support multiline strings in AWS
        for (const envName of Object.keys(process.env)) {
            process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
        }
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    public get(key: string): string {
        return process.env[key];
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    get nodeEnv(): string {
        return this.get('NODE_ENV') || 'development';
    }

    get appUrl(): string {
        return this.get('APP_URL');
    }

    get uploadDir(): string {
        return this.get('UPLOAD_DIR');
    }

    get jwtTokenSecret(): string {
        return this.get('JWT_SECRET_KEY');
    }

    get jwtTokenExpire(): number {
        return this.getNumber('JWT_EXPIRATION_TIME');
    }

    get jwtRefreshTokenSecret(): string {
        return this.get('JWT_REFRESH_SECRET_KEY');
    }

    get jwtRefreshTokenExpire(): number {
        return this.getNumber('JWT_REFRESH_EXPIRATION_TIME');
    }

    get bullConfig(): BullRootModuleOptions {
        return {
            redis: {
                host: this.get('REDIS_HOST'),
                port: this.getNumber('REDIS_PORT'),
            },
            prefix: 'bull',
        };
    }

    get typeOrmConfig(): TypeOrmModuleOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

        if ((<any>module).hot) {
            const entityContext = (<any>require).context(
                './../../modules',
                true,
                /\.entity\.ts$/,
            );
            entities = entityContext.keys().map((id) => {
                const entityModule: Record<string, unknown> = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = (<any>require).context(
                './../../migrations',
                false,
                /\.ts$/,
            );
            migrations = migrationContext.keys().map((id) => {
                const migrationModule: Record<string, unknown> =
                    migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }

        return {
            entities,
            migrations,
            keepConnectionAlive: true,
            type: 'postgres',
            host: this.get('DB_HOST'),
            port: this.getNumber('DB_PORT'),
            username: this.get('DB_USERNAME'),
            password: this.get('DB_PASSWORD'),
            database: this.get('DB_DATABASE'),
            subscribers: [],
            migrationsRun: true,
            // logging: true,
            // synchronize: true,
            logging: this.nodeEnv === 'development',
            namingStrategy: new SnakeNamingStrategy(),
            cache: {
                type: 'redis',
                duration: 60 * 1000,
                options: {
                    url: `redis://${this.get('REDIS_HOST')}:${this.get(
                        'REDIS_PORT',
                    )}`,
                },
            },
        };
    }
}
