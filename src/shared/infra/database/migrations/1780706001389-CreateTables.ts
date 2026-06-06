import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1780706001389 implements MigrationInterface {
    name = 'CreateTables1780706001389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aula" DROP COLUMN "horario_inicio_previsto"`);
        await queryRunner.query(`ALTER TABLE "aula" ADD "horario_inicio_previsto" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aula" DROP COLUMN "horario_fim_previsto"`);
        await queryRunner.query(`ALTER TABLE "aula" ADD "horario_fim_previsto" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aula" DROP COLUMN "horario_fim_previsto"`);
        await queryRunner.query(`ALTER TABLE "aula" ADD "horario_fim_previsto" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aula" DROP COLUMN "horario_inicio_previsto"`);
        await queryRunner.query(`ALTER TABLE "aula" ADD "horario_inicio_previsto" TIME NOT NULL`);
    }

}
