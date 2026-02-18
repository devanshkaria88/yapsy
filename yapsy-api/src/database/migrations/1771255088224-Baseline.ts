import { MigrationInterface, QueryRunner } from 'typeorm';

export class Baseline1771255088224 implements MigrationInterface {
  name = 'Baseline1771255088224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Enums
    await queryRunner.query(
      `CREATE TYPE "public"."admin_users_role_enum" AS ENUM('super_admin', 'moderator')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'non_binary', 'prefer_not_to_say')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_subscription_status_enum" AS ENUM('free', 'pro', 'cancelled', 'paused', 'past_due')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('pending', 'completed', 'rolled_over', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."journals_concern_level_enum" AS ENUM('low', 'medium', 'high')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."promo_codes_type_enum" AS ENUM('percentage', 'flat', 'set_price')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_plans_interval_enum" AS ENUM('monthly', 'yearly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."mood_insights_mood_trend_enum" AS ENUM('improving', 'stable', 'declining')`,
    );

    // Tables
    await queryRunner.query(`
            CREATE TABLE "admin_users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "firebase_uid" character varying,
                "name" character varying NOT NULL,
                "role" "public"."admin_users_role_enum" NOT NULL DEFAULT 'moderator',
                "refresh_token_hash" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"),
                CONSTRAINT "UQ_3b69564bd64e131c7862cf8aa32" UNIQUE ("firebase_uid"),
                CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "firebase_uid" character varying NOT NULL,
                "name" character varying,
                "avatar_url" character varying,
                "auth_provider" character varying,
                "timezone" character varying NOT NULL DEFAULT 'Asia/Kolkata',
                "is_onboarded" boolean NOT NULL DEFAULT false,
                "date_of_birth" date,
                "gender" "public"."users_gender_enum",
                "subscription_status" "public"."users_subscription_status_enum" NOT NULL DEFAULT 'free',
                "razorpay_subscription_id" character varying,
                "razorpay_customer_id" character varying,
                "current_streak" integer NOT NULL DEFAULT 0,
                "total_check_ins" integer NOT NULL DEFAULT 0,
                "weekly_check_in_count" integer NOT NULL DEFAULT 0,
                "weekly_check_in_reset_date" date,
                "last_check_in_date" date,
                "fcm_token" character varying,
                "refresh_token_hash" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_0fd54ced5cc75f7cb92925dd803" UNIQUE ("firebase_uid"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "title" character varying NOT NULL,
                "description" text,
                "scheduled_date" date NOT NULL,
                "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pending',
                "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'medium',
                "rolled_from_id" uuid,
                "completed_at" TIMESTAMP,
                "source" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "journals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "date" date NOT NULL,
                "elevenlabs_conversation_id" character varying,
                "duration_seconds" integer NOT NULL DEFAULT 0,
                "transcript" jsonb NOT NULL DEFAULT '[]',
                "summary" text,
                "mood_score" integer,
                "mood_label" character varying,
                "themes" text[] NOT NULL DEFAULT '{}',
                "wins" text[] NOT NULL DEFAULT '{}',
                "struggles" text[] NOT NULL DEFAULT '{}',
                "people_mentioned" text[] NOT NULL DEFAULT '{}',
                "concern_level" "public"."journals_concern_level_enum" NOT NULL DEFAULT 'low',
                "actions_taken" jsonb NOT NULL DEFAULT '[]',
                "processing_status" character varying NOT NULL DEFAULT 'pending',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fefd17fa789389d0f1d0f28aba2" UNIQUE ("user_id", "date"),
                CONSTRAINT "PK_157a30136385dd81cdd19111380" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "notes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "content" text NOT NULL,
                "follow_up_date" date,
                "is_resolved" boolean NOT NULL DEFAULT false,
                "source" character varying,
                "journal_id" uuid,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "promo_codes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying NOT NULL,
                "type" "public"."promo_codes_type_enum" NOT NULL,
                "value" integer NOT NULL,
                "duration_months" integer,
                "max_uses" integer,
                "current_uses" integer NOT NULL DEFAULT 0,
                "valid_from" TIMESTAMP NOT NULL,
                "valid_until" TIMESTAMP,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_2f096c406a9d9d5b8ce204190c3" UNIQUE ("code"),
                CONSTRAINT "PK_c7b4f01710fda5afa056a2b4a35" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "user_promo_redemptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "promo_code_id" uuid NOT NULL,
                "redeemed_at" TIMESTAMP NOT NULL,
                "effective_until" TIMESTAMP,
                CONSTRAINT "UQ_c678f30dd8b98c98efbb64cc094" UNIQUE ("user_id", "promo_code_id"),
                CONSTRAINT "PK_232a06df6d62a78d35bb0e646bf" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "subscription_plans" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "razorpay_plan_id" character varying,
                "price_amount" integer NOT NULL,
                "currency" character varying NOT NULL DEFAULT 'INR',
                "interval" "public"."subscription_plans_interval_enum" NOT NULL,
                "features" jsonb NOT NULL DEFAULT '{}',
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "mood_insights" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "week_start" date NOT NULL,
                "avg_mood" double precision,
                "mood_trend" "public"."mood_insights_mood_trend_enum",
                "top_themes" text[] NOT NULL DEFAULT '{}',
                "productivity_score" double precision,
                "insight_text" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f48d18f6e178a8955b381cf4248" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "webhook_events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "source" character varying NOT NULL,
                "event_type" character varying NOT NULL,
                "payload" jsonb NOT NULL,
                "processed" boolean NOT NULL DEFAULT false,
                "error" text,
                "razorpay_event_id" character varying,
                "received_at" TIMESTAMP NOT NULL DEFAULT now(),
                "processed_at" TIMESTAMP,
                CONSTRAINT "PK_4cba37e6a0acb5e1fc49c34ebfd" PRIMARY KEY ("id")
            )
        `);

    // Foreign keys
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_a5386ec73352e3a0d91adbde6e8" FOREIGN KEY ("rolled_from_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "journals" ADD CONSTRAINT "FK_dcd8f26897887ea1ca19e9b910a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_promo_redemptions" ADD CONSTRAINT "FK_634c729f4861d5a9283d6c1eccf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_promo_redemptions" ADD CONSTRAINT "FK_860921c1d9231f7f2998db58056" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mood_insights" ADD CONSTRAINT "FK_75186c613ced3909693dde6bc28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "mood_insights" DROP CONSTRAINT "FK_75186c613ced3909693dde6bc28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_promo_redemptions" DROP CONSTRAINT "FK_860921c1d9231f7f2998db58056"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_promo_redemptions" DROP CONSTRAINT "FK_634c729f4861d5a9283d6c1eccf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "journals" DROP CONSTRAINT "FK_dcd8f26897887ea1ca19e9b910a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_a5386ec73352e3a0d91adbde6e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "webhook_events"`);
    await queryRunner.query(`DROP TABLE "mood_insights"`);
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TABLE "user_promo_redemptions"`);
    await queryRunner.query(`DROP TABLE "promo_codes"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "journals"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "admin_users"`);

    // Drop enums
    await queryRunner.query(
      `DROP TYPE "public"."mood_insights_mood_trend_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscription_plans_interval_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."promo_codes_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."journals_concern_level_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."users_subscription_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."admin_users_role_enum"`);
  }
}
