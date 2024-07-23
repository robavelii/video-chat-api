import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from './socket.gateway';

@Module({
    imports:[AuthModule]
    , providers: [SocketGateway, JwtService]
})
export class GatewayModule {}
