import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendEventTypes1686066440392 implements MigrationInterface {
    name = 'ExtendEventTypes1686066440392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "date" date`);
        await queryRunner.query(`ALTER TABLE "event" ADD "location_id" integer`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_ff5c43e186f7faf15a975004d76" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ff5c43e186f7faf15a975004d76"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "date"`);
    }

}
