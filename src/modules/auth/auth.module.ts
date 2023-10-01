import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserStrategy } from './strategies/user.strategy';

@Module({
    imports: [
        PassportModule.register({}),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [AuthController, UserController],
    providers: [AuthService, UserService, UserStrategy],
    exports: [AuthService, UserService],
})
export class AuthModule {}
