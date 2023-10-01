import { MigrationInterface, QueryRunner } from 'typeorm';
import { UtilsService } from '../providers/utils.service';

export class CreateUser1696154818149 implements MigrationInterface {
    name = 'CreateUser1696154818149';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER')`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "refresh_token" character varying, "last_login" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'MANAGER', "is_suspended" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_5230070094e8135a3d763d90e7" ON "users" ("refresh_token") `,
        );

        await queryRunner.query(
            `INSERT INTO "users" ("email", "password", "first_name", "last_name", "role") VALUES ('admin@admin.com', '${UtilsService.generateHash(
                'admin',
            )}', 'admin', 'admin', 'SUPER_ADMIN')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "public"."IDX_5230070094e8135a3d763d90e7"`,
        );
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
