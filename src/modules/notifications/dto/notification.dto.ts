import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { UserDto } from "../../auth/dto/user/user.dto";
import { NotitficationEntity } from "../entities/notification.entity";

export class NotificationDto extends AbstractDto{
    @ApiProperty()
    title: string;
    
    @ApiProperty()
    content: string;

    @ApiProperty()
    to: UserDto;

    @ApiProperty()
    seen: boolean;

    constructor(notification: NotitficationEntity){
        super(notification)
        this.content = notification.content;
        this.title = notification.title;
        this.to = notification.to.toDto();
        this.seen = notification.seen
    }
}