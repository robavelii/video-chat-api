/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* tslint:disable:naming-convention */

import { Transform } from 'class-transformer';
// eslint-disable-next-line @typescript-eslint/tslint/config
import { castArray, isNil } from 'lodash';
/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
export function ToInt() {
    return Transform(
        (params) => {
            const value = String(params.value);
            return parseInt(value, 10);
        },
        { toClassOnly: true },
    );
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): (target: any, key: string) => void {
    return Transform(
        (params) => {
            const value = params.value;
            if (isNil(value)) {
                return [];
            }
            return castArray(value);
        },
        { toClassOnly: true },
    );
}
