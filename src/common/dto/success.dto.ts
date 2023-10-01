import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
    @ApiProperty()
    success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }
}
