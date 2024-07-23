import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractIdEntity } from "../../../common/abstract.id.entity";
import { NotificationDto } from "../dto/notification.dto";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity({name: "notifications"})
export class NotitficationEntity extends AbstractIdEntity<NotificationDto>{

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'text'})
    content: string;

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'to'})
    to: UserEntity;

    @Column({default: false})
    seen: boolean;

    
    dtoClass = NotificationDto
}