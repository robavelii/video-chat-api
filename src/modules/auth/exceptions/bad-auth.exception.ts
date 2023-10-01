import { UnauthorizedException } from '@nestjs/common';

export class BadAuthException extends UnauthorizedException {
    constructor() {
        super('Error while authenticating');
    }
}
