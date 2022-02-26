// import {MigrationInterface, QueryRunner} from "typeorm";

// export class setup1645842776701 implements MigrationInterface {
//     name = 'setup1645842776701'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
//         await queryRunner.query(`
//         CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
//         RETURNS TRIGGER AS $$ 
//         BEGIN
//             NEW.updatedAt = NOW();
//             RETURN NEW;
//         END;
//         $$ LANGUAGE plpgsql;
//         `);
//         await queryRunner.query(`CREATE TYPE "public"."ticket_status_enum" AS ENUM('todo', 'done')`);
//         await queryRunner.query(`CREATE TABLE IF NOT EXISTS "ticket" ("id" UUID DEFAULT uuid_generate_v1mc() NOT NULL, "description" character varying(255) NOT NULL, "creatorID" character varying NOT NULL, "assigneeID" character varying NOT NULL, "status" "public"."ticket_status_enum" NOT NULL DEFAULT 'todo', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "categoriesId" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('customer', 'developer')`);
//         await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" ("id" UUID DEFAULT uuid_generate_v1mc() NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_30a289a46041cd5aff137e96116" FOREIGN KEY ("categoriesId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`CREATE TRIGGER set_timestamp BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()`);
//         await queryRunner.query(`
//         CREATE TRIGGER set_timestamp
//         BEFORE UPDATE ON "ticket"
//         FOR EACH ROW 
//         EXECUTE PROCEDURE trigger_set_timestamp()        
//         `);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp CASCADE"`);
//         await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_30a289a46041cd5aff137e96116"`);
//         await queryRunner.query(`DROP TABLE "user"`);
//         await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
//         await queryRunner.query(`DROP TABLE "ticket"`);
//         await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
//     }

// }
