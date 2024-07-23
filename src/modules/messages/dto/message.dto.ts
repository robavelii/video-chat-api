import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageType } from '../constants/message-type';
import { UserDto } from '../../auth/dto/user/user.dto';
import { ContactType } from '../constants/contact-type';

export class MessageDto extends AbstractDto {
    
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @ApiProperty()
  text: string;

  @ApiProperty()
  from: UserDto;

  @ApiProperty()
  to: UserDto;

  @ApiProperty({ nullable: true })
  image: string;

  @ApiProperty({ nullable: true })
  doc: string;

  @ApiProperty({ nullable: true })
  voice: string;

  @ApiProperty({ nullable: true, type: ContactType })
  contact: ContactType;

  @ApiProperty({ nullable: true })
  avatar: string;

  @ApiProperty({ nullable: true })
  authorName: string;

  @ApiProperty({ type: [UserDto] })
  readers: UserDto[];

    constructor(message: MessageEntity) {
        super(message);
    this.type = message.type;
    this.text = message.text;
    this.from = message.from.toDto();
    this.to = message.to.toDto();
    this.image = message.image;
    this.doc = message.doc;
    this.voice = message.voice;
    this.contact = message.contact;
    this.avatar = message.avatar;
    this.authorName = message.authorName;
    this.readers = message.readers.map(user => user.toDto());
        }
}
