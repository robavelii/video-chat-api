import { MigrationInterface, QueryRunner } from "typeorm";
import { UtilsService } from "../providers/utils.service";

export class UserLocationEventCreate1685987251385 implements MigrationInterface {
    name = 'UserLocationEventCreate1685987251385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF_MEMBER')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "name" character varying, "middle_name" character varying, "surname" character varying, "refresh_token" character varying, "last_login" TIMESTAMP, "role" "public"."users_role_enum" NOT NULL DEFAULT 'MANAGER', "is_active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5230070094e8135a3d763d90e7" ON "users" ("refresh_token") `);
        await queryRunner.query(`CREATE TABLE "location" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying, "color" integer, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" integer NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "users"( "email", "password", "name", "middle_name", "surname",  "role", "is_active") VALUES ('admin@admin.com','${UtilsService.generateHash('adminadmin')}','admin','admin','admin','SUPER_ADMIN', true) `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5230070094e8135a3d763d90e7"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
