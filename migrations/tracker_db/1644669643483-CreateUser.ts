import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUser1644669643483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.createTable()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
