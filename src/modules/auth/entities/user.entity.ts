import { Column, Entity, Index } from 'typeorm';

import { AbstractIdEntity } from '../../../common/abstract.id.entity';
import { UserRole } from '../constants/user-role';
import { UserDto } from '../dto/user/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractIdEntity<UserDto> {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    middleName: string;

    @Column({ nullable: false })
    surname: string;

    @Column({ nullable: true })
    @Index()
    refreshToken: string;

    @Column({ nullable: true })
    lastLogin: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.MANAGER })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    dtoClass = UserDto;
}
