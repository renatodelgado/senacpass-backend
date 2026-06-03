import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1780494788038 implements MigrationInterface {
    name = 'CreateTables1780494788038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aluno" ("id_aluno" uuid NOT NULL DEFAULT uuid_generate_v4(), "matricula_institucional" character varying(50) NOT NULL, "rfid_uid" character varying(50) NOT NULL, "nome" character varying(255) NOT NULL, "email" character varying(150) NOT NULL, CONSTRAINT "UQ_d5c207e2309c6fe07cbe1889e28" UNIQUE ("matricula_institucional"), CONSTRAINT "UQ_290cbbeeb5f194e72e9f1d0c67d" UNIQUE ("rfid_uid"), CONSTRAINT "UQ_29a948302c3a739d7b20773e182" UNIQUE ("email"), CONSTRAINT "PK_8a2d97bc538f6b5804aad14ebda" PRIMARY KEY ("id_aluno"))`);
        await queryRunner.query(`CREATE TABLE "professor" ("id_professor" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(255) NOT NULL, "email" character varying(150) NOT NULL, "senha_hash" character varying(255) NOT NULL, CONSTRAINT "UQ_492e744e6333071da912c7d651b" UNIQUE ("email"), CONSTRAINT "PK_cddf840e8f4fd40a309a7f98365" PRIMARY KEY ("id_professor"))`);
        await queryRunner.query(`CREATE TABLE "unidade_curricular" ("id_unidade_curricular" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying(150) NOT NULL, "carga_horaria" integer NOT NULL, CONSTRAINT "PK_76ac1f54f3be518933667bba587" PRIMARY KEY ("id_unidade_curricular"))`);
        await queryRunner.query(`CREATE TABLE "turma" ("id_turma" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo_turma" character varying(50) NOT NULL, "id_unidade_curricular" uuid, "id_professor" uuid, CONSTRAINT "UQ_517c3e4059223ec0f3c01241156" UNIQUE ("codigo_turma"), CONSTRAINT "PK_6d489469929b1347dffcc0c67c0" PRIMARY KEY ("id_turma"))`);
        await queryRunner.query(`CREATE TABLE "dispositivo" ("id_dispositivo" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_hardware" character varying NOT NULL, "localizacao" character varying, "ip" character varying, "status" character varying NOT NULL DEFAULT 'ATIVO', "ultima_conexao" TIMESTAMP, CONSTRAINT "UQ_77f26803672d5807d1b2ea8bff5" UNIQUE ("id_hardware"), CONSTRAINT "PK_e66ae729077ad8f47a85971c190" PRIMARY KEY ("id_dispositivo"))`);
        await queryRunner.query(`CREATE TYPE "public"."aula_status_enum" AS ENUM('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA')`);
        await queryRunner.query(`CREATE TABLE "aula" ("id_aula" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_aula" date NOT NULL, "status" "public"."aula_status_enum" NOT NULL DEFAULT 'AGENDADA', "horario_inicio_previsto" TIME NOT NULL, "horario_fim_previsto" TIME NOT NULL, "id_turma" uuid, "id_dispositivo" uuid, CONSTRAINT "PK_93cc459191b4d2e74e86ab65303" PRIMARY KEY ("id_aula"))`);
        await queryRunner.query(`CREATE TYPE "public"."inscricao_turma_status_enum" AS ENUM('ATIVO', 'TRANCADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TABLE "inscricao_turma" ("id_inscricao" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_inscricao" date NOT NULL DEFAULT now(), "status" "public"."inscricao_turma_status_enum" NOT NULL DEFAULT 'ATIVO', "id_aluno" uuid, "id_turma" uuid, CONSTRAINT "PK_61c40805e5ec8d287bc8015bb97" PRIMARY KEY ("id_inscricao"))`);
        await queryRunner.query(`CREATE TABLE "log_acesso" ("id_log" uuid NOT NULL DEFAULT uuid_generate_v4(), "rfid_uid" character varying NOT NULL, "data_hora" TIMESTAMP NOT NULL DEFAULT now(), "tipo_evento" character varying(50) NOT NULL, "id_dispositivo" uuid, CONSTRAINT "PK_10c84d60f05c4e2d43d71c741b8" PRIMARY KEY ("id_log"))`);
        await queryRunner.query(`CREATE TYPE "public"."registro_presenca_status_enum" AS ENUM('PRESENTE', 'AUSENTE', 'JUSTIFICADO', 'ATRASADO')`);
        await queryRunner.query(`CREATE TABLE "registro_presenca" ("id_presenca" uuid NOT NULL DEFAULT uuid_generate_v4(), "horario_checkin" TIMESTAMP, "horario_checkout" TIMESTAMP, "tempo_permanencia_minutos" integer NOT NULL DEFAULT '0', "status" "public"."registro_presenca_status_enum" NOT NULL DEFAULT 'AUSENTE', "justificativa_manual" text, "id_aluno" uuid, "id_aula" uuid, CONSTRAINT "PK_de72fbd21dedc47dd6415a9f56a" PRIMARY KEY ("id_presenca"))`);
        await queryRunner.query(`ALTER TABLE "turma" ADD CONSTRAINT "FK_9e94e963d4a8e45f659b0eec7ff" FOREIGN KEY ("id_unidade_curricular") REFERENCES "unidade_curricular"("id_unidade_curricular") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "turma" ADD CONSTRAINT "FK_d26008f51d266b87ee2299b6df8" FOREIGN KEY ("id_professor") REFERENCES "professor"("id_professor") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aula" ADD CONSTRAINT "FK_0e34fe4f1749956a6b17354e839" FOREIGN KEY ("id_turma") REFERENCES "turma"("id_turma") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aula" ADD CONSTRAINT "FK_9ccf117d3ca0cddc445dd06d1ad" FOREIGN KEY ("id_dispositivo") REFERENCES "dispositivo"("id_dispositivo") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_turma" ADD CONSTRAINT "FK_49444bc53b1140488598e850c6d" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_turma" ADD CONSTRAINT "FK_b8d60ed6dac96b93edba53a755b" FOREIGN KEY ("id_turma") REFERENCES "turma"("id_turma") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_acesso" ADD CONSTRAINT "FK_f939ef5d249f124fe4f6b1e688a" FOREIGN KEY ("id_dispositivo") REFERENCES "dispositivo"("id_dispositivo") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "registro_presenca" ADD CONSTRAINT "FK_7a505dfc54758177043b55e9a1a" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id_aluno") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "registro_presenca" ADD CONSTRAINT "FK_e4e7ff15eedb8952b95aee431f8" FOREIGN KEY ("id_aula") REFERENCES "aula"("id_aula") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registro_presenca" DROP CONSTRAINT "FK_e4e7ff15eedb8952b95aee431f8"`);
        await queryRunner.query(`ALTER TABLE "registro_presenca" DROP CONSTRAINT "FK_7a505dfc54758177043b55e9a1a"`);
        await queryRunner.query(`ALTER TABLE "log_acesso" DROP CONSTRAINT "FK_f939ef5d249f124fe4f6b1e688a"`);
        await queryRunner.query(`ALTER TABLE "inscricao_turma" DROP CONSTRAINT "FK_b8d60ed6dac96b93edba53a755b"`);
        await queryRunner.query(`ALTER TABLE "inscricao_turma" DROP CONSTRAINT "FK_49444bc53b1140488598e850c6d"`);
        await queryRunner.query(`ALTER TABLE "aula" DROP CONSTRAINT "FK_9ccf117d3ca0cddc445dd06d1ad"`);
        await queryRunner.query(`ALTER TABLE "aula" DROP CONSTRAINT "FK_0e34fe4f1749956a6b17354e839"`);
        await queryRunner.query(`ALTER TABLE "turma" DROP CONSTRAINT "FK_d26008f51d266b87ee2299b6df8"`);
        await queryRunner.query(`ALTER TABLE "turma" DROP CONSTRAINT "FK_9e94e963d4a8e45f659b0eec7ff"`);
        await queryRunner.query(`DROP TABLE "registro_presenca"`);
        await queryRunner.query(`DROP TYPE "public"."registro_presenca_status_enum"`);
        await queryRunner.query(`DROP TABLE "log_acesso"`);
        await queryRunner.query(`DROP TABLE "inscricao_turma"`);
        await queryRunner.query(`DROP TYPE "public"."inscricao_turma_status_enum"`);
        await queryRunner.query(`DROP TABLE "aula"`);
        await queryRunner.query(`DROP TYPE "public"."aula_status_enum"`);
        await queryRunner.query(`DROP TABLE "dispositivo"`);
        await queryRunner.query(`DROP TABLE "turma"`);
        await queryRunner.query(`DROP TABLE "unidade_curricular"`);
        await queryRunner.query(`DROP TABLE "professor"`);
        await queryRunner.query(`DROP TABLE "aluno"`);
    }

}
