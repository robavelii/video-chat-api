import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractIdEntity } from "../../../common/abstract.id.entity";
import { FriendRequestDto } from "../dto/friend-request.dto";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity({name: 'friend_requests'})
export class FriendRequestEntity extends AbstractIdEntity<FriendRequestDto>{

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'sender_id'})
    senderId: UserEntity;
   
    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'receiver_id'})
    receiverId: UserEntity;

    @Column({ type: 'text'})
    text: string;
    
    dtoClass = FriendRequestDto
}