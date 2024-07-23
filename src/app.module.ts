import './boilerplate.polyfill';

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { GatewayModule } from './gateway/gateway.module';
import { GatewayModule } from './src/modules/gateway/gateway.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { MessagesModule } from './modules/messages/messages.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.bullConfig,
            inject: [ConfigService],
        }),
        AuthModule,
        GatewayModule,
        MessagesModule,
        GroupsModule,
        ContactsModule,
        NotificationsModule,
       
    ],
})
export class AppModule {}
