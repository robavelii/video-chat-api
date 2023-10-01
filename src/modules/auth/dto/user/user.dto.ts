import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserRole } from '../../constants/user-role';
import { UserEntity } from '../../entities/user.entity';

export class UserDto extends AbstractDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    middleName: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    lastLogin: Date;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiProperty()
    isActive: boolean;

    constructor(user: UserEntity) {
        super(user);

        this.email = user.email;
        this.name = user.name;
        this.middleName = user.middleName;
        this.createdAt = user.createdAt;
        this.lastLogin = user.lastLogin;
        this.role = user.role;
        this.isActive = user.isActive;
    }
}
