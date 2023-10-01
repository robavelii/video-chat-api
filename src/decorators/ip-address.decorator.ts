import { createParamDecorator } from '@nestjs/common';
import * as requestIp from 'request-ip';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const IpAddress = createParamDecorator((_, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.clientIp) {
        return request.clientIp;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return requestIp.getClientIp(request);
});
