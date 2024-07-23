import { Column, Entity, Index } from 'typeorm';

import { AbstractIdEntity } from '../../../common/abstract.id.entity';
import { UserRole } from '../constants/user-role';
import { UserDto } from '../dto/user/user.dto';
import { defaultAvatarUrl } from 'src/config';
import { UserStatus } from '../constants/user-status';


@Entity({ name: 'users' })
export class UserEntity extends AbstractIdEntity<UserDto> {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true})
    about: string;

    @Column({default: defaultAvatarUrl})
    avatar: string;

    @Column({type: 'enum', enum: UserStatus, default: UserStatus.OFFLINE})
    status: UserStatus;
    
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    @Index()
    refreshToken: string;

    @Column({ nullable: true })
    lastLogin: Date;

    @Column({ default: false })
    isSuspended: boolean;

    @Column({default: false})
    verified: boolean;

    @Column({nullable: true})
    verifyCode: string;

    @Column({default: 0})
    verifyCodeExpiredTime: number;

    dtoClass = UserDto;
}
