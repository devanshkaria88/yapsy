import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWaitlistEntries1771255088225 implements MigrationInterface {
    name = 'AddWaitlistEntries1771255088225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "waitlist_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "country" character varying, "utm_source" character varying, "utm_medium" character varying, "utm_campaign" character varying, "ip_address" character varying, "synced_to_resend" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_90cae6cb55d051291054d7e8d12" UNIQUE ("email"), CONSTRAINT "PK_bd0ef66fff81d3be7b7a1568a4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90cae6cb55d051291054d7e8d1" ON "waitlist_entries" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_90cae6cb55d051291054d7e8d1"`);
        await queryRunner.query(`DROP TABLE "waitlist_entries"`);
    }

}
