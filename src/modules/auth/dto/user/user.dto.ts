import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { UserRole } from '../../constants/user-role';
import { UserEntity } from '../../entities/user.entity';
import { UserStatus } from '../../constants/user-status';

export class UserDto extends AbstractDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    about: string;
    
    @ApiProperty()
    avatar: string;
    
    @ApiProperty({enum: UserStatus})
    status: UserStatus

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    lastLogin: Date;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiProperty()
    isSuspended: boolean;
    
    @ApiProperty()
    verified: boolean;
     
    @ApiProperty()
    verifyCode: string;

    @ApiProperty()
    verifyCodeExpiredTime: number;


    constructor(user: UserEntity) {
        super(user);

        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.avatar = user.avatar;
        this.about = user.about;
        this.status = user.status
        this.createdAt = user.createdAt;
        this.lastLogin = user.lastLogin;
        this.role = user.role;
        this.isSuspended = user.isSuspended;
        this.verified = user.verified;
        this.verifyCode = user.verifyCode;
        this.verifyCodeExpiredTime = user.verifyCodeExpiredTime;
    }
}
