import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SuccessDto } from '../../../common/dto/success.dto';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { Auth } from '../../../decorators/http.decorators';
import { USER_ROLE_RANK, UserRole } from '../constants/user-role';
import { UserDto } from '../dto/user/user.dto';
import { UserCreateDto } from '../dto/user/user-create.dto';
import { UserFindAllDto } from '../dto/user/user-find-all.dto';
import { UserUpdateDto } from '../dto/user/user-update.dto';
import { UserUpdateCurrentDto } from '../dto/user/user-update-current';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    private async findById(id: number, isAdminRequest = false) {
        const user = await this.userService.findById(
            id,
            !isAdminRequest ? undefined : { includeSuspended: true },
        );
        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    @Get('current')
    @Auth({ loadUser: true })
    @ApiResponse({ type: UserDto })
    getCurrentUser(@CurrentUser() user: UserEntity) {
        return user.toDto();
    }

    @Put('current')
    @Auth({ loadUser: true })
    @ApiResponse({ type: UserDto })
    async updateCurrentUser(
        @CurrentUser() user: UserEntity,
        @Body() dto: UserUpdateCurrentDto,
    ) {
        return (await this.userService.update(user, dto)).toDto();
    }

    @Get()
    @Auth({ roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] })
    @ApiResponse({ type: PaginationDto })
    async getAllUsers(
        @Query() dto: UserFindAllDto,
    ): Promise<PaginationDto<UserDto>> {
        const [users, count] = await this.userService.findByDto(dto);
        // eslint-disable-next-line @typescript-eslint/tslint/config
        return { results: users.map((user) => user.toDto()), count };
    }

    @Get(':id')
    @Auth({ roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] })
    @ApiResponse({ type: UserDto })
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
        const user = await this.findById(id, true);
        return user.toDto();
    }

    @Post()
    @Auth({ loadUser: true, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] })
    @ApiResponse({ type: UserDto })
    async createUser(
        @Body() dto: UserCreateDto,
        @CurrentUser() currentUser: UserEntity,
    ): Promise<UserDto> {
        if (USER_ROLE_RANK[currentUser.role] < USER_ROLE_RANK[dto.role]) {
            throw new ForbiddenException("Can't create user with higher role");
        }
        return (await this.userService.create(dto)).toDto();
    }

    @Put(':id')
    @Auth({ loadUser: true, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] })
    @ApiResponse({ type: UserDto })
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UserUpdateDto,
        @CurrentUser() currentUser: UserEntity,
    ): Promise<UserDto> {
        const user = await this.findById(id, true);
        if (USER_ROLE_RANK[currentUser.role] < USER_ROLE_RANK[user.role]) {
            throw new ForbiddenException("Can't change user with higher role");
        }
        if (
            dto.role &&
            USER_ROLE_RANK[currentUser.role] < USER_ROLE_RANK[dto.role]
        ) {
            throw new ForbiddenException(
                "Can't give user higher role than yours",
            );
        }
        return (await this.userService.update(user, dto)).toDto();
    }

    @Delete(':id')
    @Auth({ loadUser: true, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] })
    @ApiResponse({ type: SuccessDto })
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() currentUser: UserEntity,
    ): Promise<SuccessDto> {
        const user = await this.findById(id, true);
        if (USER_ROLE_RANK[currentUser.role] < USER_ROLE_RANK[user.role]) {
            throw new ForbiddenException("Can't delete user with higher role");
        }
        await this.userService.delete(user);
        return new SuccessDto(true);
    }
}
