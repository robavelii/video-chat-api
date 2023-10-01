export const queryFailedCodes: Record<
    string,
    { code: number; message: string }
> = {
    '23505': { code: 409, message: 'Duplicate data' },
    '22P02': { code: 400, message: 'Invalid format for one of fields' },
    '22003': { code: 400, message: 'Numeric out of range' },
};
