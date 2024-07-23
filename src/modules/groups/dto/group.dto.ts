import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { UserDto } from "../../auth/dto/user/user.dto";
import { GroupEntity } from "../entities/group.entity";

export class GroupDto extends AbstractDto{
   
  @ApiProperty()
  groupName: string;

  @ApiProperty({ type: [UserDto] })
  members: UserDto[];

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createdBy: UserDto;

  constructor(group: GroupEntity) {
    super(group)
    this.groupName = group.groupName;
    this.members = group.members.map((member) => member.toDto());
    this.avatar = group.avatar;
    this.createdBy = group.createdBy.toDto();
}
}