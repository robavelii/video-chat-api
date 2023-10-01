import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AbstractEntityService } from '../../../common/abstract.entity.service';
import { UtilsService } from '../../../providers/utils.service';
import { UserCreateDto } from '../dto/user/user-create.dto';
import { UserFindAllDto } from '../dto/user/user-find-all.dto';
import { UserUpdateDto } from '../dto/user/user-update.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService extends AbstractEntityService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
        super();
    }

    findById(
        id: number,
        options: {
            includeSuspended?: boolean;
            refreshToken?: string;
        } = { includeSuspended: false },
    ): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: {
                id,
                isActive: options.includeSuspended ? undefined : true,
                refreshToken: options.refreshToken,
            },
        });
    }

    findByIds(ids: number[]): any {
        return this.userRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: { email },
        });
    }

    update(user: UserEntity, dto: UserUpdateDto): Promise<UserEntity> {
        if (dto.password) {
            dto.password = UtilsService.generateHash(dto.password);
        }
        Object.assign(user, dto);

        return this.userRepository.save(user);
    }

    updateRefreshToken(
        user: UserEntity,
        refreshToken: string,
    ): Promise<UserEntity> {
        user.refreshToken = refreshToken;
        return this.userRepository.save(user);
    }

    async delete(user: UserEntity): Promise<void> {
        await this.userRepository.remove(user);
    }

    create(dto: UserCreateDto): Promise<UserEntity> {
        const user = new UserEntity();
        return this.update(user, dto);
    }

    findByDto(dto: UserFindAllDto): Promise<[UserEntity[], number]> {
        const query = this.createQueryBuilderDto(
            this.userRepository.createQueryBuilder('user'),
            dto,
        );

        return query.getManyAndCount();
    }

    refreshLastLogin(user: UserEntity): any {
        user.lastLogin = new Date();
        return this.userRepository.save(user);
    }
}
