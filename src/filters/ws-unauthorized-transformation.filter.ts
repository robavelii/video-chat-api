import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(UnauthorizedException)
export class WsUnauthorizedTransformationFilter extends BaseWsExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const properException = new WsException(exception.getResponse());
        super.catch(properException, host);
    }
}
