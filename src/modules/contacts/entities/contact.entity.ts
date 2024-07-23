import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractIdEntity } from "../../../common/abstract.id.entity";
import { ContactDto } from "../dto/contact.dto";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity({ name: 'contacts' })
export class ContactEntity extends AbstractIdEntity<ContactDto> {
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({ default: false })
  isBlocked: boolean;

  @ManyToOne(() => UserEntity, { nullable: true })
  blockedBy: UserEntity;

  dtoClass = ContactDto;
}
