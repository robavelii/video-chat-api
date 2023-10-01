import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserRole } from '../../constants/user-role';
import { UserEntity } from '../../entities/user.entity';

export class UserDto extends AbstractDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    lastLogin: Date;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiProperty()
    isSuspended: boolean;

    constructor(user: UserEntity) {
        super(user);

        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.createdAt = user.createdAt;
        this.lastLogin = user.lastLogin;
        this.role = user.role;
        this.isSuspended = user.isSuspended;
    }
}
