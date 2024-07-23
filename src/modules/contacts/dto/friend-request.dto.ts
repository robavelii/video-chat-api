import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { UserDto } from "../../auth/dto/user/user.dto";
import { FriendRequestEntity } from "../entities/friend-request.entity";

export class FriendRequestDto extends AbstractDto{
  @ApiProperty()
   senderId: UserDto;

  @ApiProperty()
  receiverId: UserDto;

  @ApiProperty()
  text: string;

  constructor(friendRequest: FriendRequestEntity) {
    super(friendRequest)
    this.senderId = friendRequest.senderId.toDto();
    this.receiverId = friendRequest.receiverId.toDto();
    this.text = friendRequest.text;
  }
}