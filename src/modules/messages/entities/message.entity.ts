import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { AbstractIdEntity } from "../../../common/abstract.id.entity";
import { MessageDto } from "../dto/message.dto";
import { MessageType } from "../constants/message-type";
import { UserEntity } from "../../auth/entities/user.entity";
import { ContactType } from "../constants/contact-type";



@Entity({name: 'messages'})
export class MessageEntity extends AbstractIdEntity<MessageDto>{
    @Column({type: 'enum', enum: MessageType, default: MessageType.TEXT})
    type: MessageType;

    @Column({type: "text", default: ''})
    text: string;

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'from'})
    from: UserEntity;
   
    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'to'})
    to: UserEntity;

    @Column({nullable: true})
    image: string;

    @Column({nullable: true})
    doc: string;

    @Column({nullable: true})
    voice: string;

    @Column(type => ContactType, {nullable: true})
    contact: ContactType;

    @Column({nullable: true})
    avatar: string;

    @Column({nullable: true})
    authorName: string;

    @ManyToMany(()=> UserEntity, {eager: true})
    @JoinTable({
        name: 'message_readers',
        joinColumn: {name: 'message_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'user_id', referencedColumnName: 'id'},
    })
    readers: UserEntity[];

    dtoClass =MessageDto
};