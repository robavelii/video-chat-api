import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../auth/dto/user/user.dto';
import { ContactEntity } from '../entities/contact.entity';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class ContactDto extends AbstractDto {
    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    isBlocked: boolean;

    @ApiProperty({nullable: true})
    blockedBy?: UserDto

    constructor(contact: ContactEntity) {
        super(contact);

        this.user = contact.user.toDto();
        this.isBlocked = contact.isBlocked;
        this.blockedBy = contact.blockedBy ? contact.blockedBy.toDto() : null;
        }
}
