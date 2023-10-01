import bcrypt from 'bcrypt';

export class UtilsService {
    /**
     * convert entity to dto class instance
     * @param {{new(entity: E, options: any): T}} model
     * @param {E[] | E} entity
     * @param options
     * @returns {T[] | T}
     */
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E,
        options?: Record<string, any>,
    ): T;

    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E[],
        options?: Record<string, any>,
    ): T[];

    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: Record<string, any>,
    ): T | T[] {
        if (Array.isArray(entity)) {
            return entity.map((u) => new model(u, options));
        }

        return new model(entity, options);
    }

    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * generate random string
     * @param length
     * @param characters
     */
    static generateRandomString(
        length: number,
        characters: string | null = null,
    ): string {
        const result = [];
        if (characters === null) {
            characters = '0123456789zxcvbnmasdfghjklqwertyuiop_%$#!@^*';
        }
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result.push(
                characters.charAt(Math.floor(Math.random() * charactersLength)),
            );
        }
        return result.join('');
    }

    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    static validateHash(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) {
            return Promise.resolve(false);
        }
        return bcrypt.compare(password, hash);
    }
}
