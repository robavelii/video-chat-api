import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { AbstractIdEntity } from "../../../common/abstract.id.entity";
import { GroupDto } from "../dto/group.dto";
import { UserEntity } from "../../auth/entities/user.entity";

@Entity({name: 'groups'})
export class GroupEntity extends AbstractIdEntity<GroupDto>{
   
    @Column({type: 'varchar', length: 255})
    groupName: string;

    @ManyToMany(()=> UserEntity, {eager: true})
    @JoinTable({
        name: 'group_members',
        joinColumn: {name: 'group_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name:'user_id', referencedColumnName: 'id'}
    })
    members: UserEntity[]

    @Column({type: 'varchar', length:255})
    avatar: string;

    @ManyToOne(()=> UserEntity, {eager: true})
    @JoinColumn({name: 'created_by'})
    createdBy: UserEntity
   
    dtoClass = GroupDto
    
}