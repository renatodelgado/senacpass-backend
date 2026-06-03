import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Aluno } from '../../alunos/entities/Aluno';
import { Turma } from '../../turmas/entities/Turma';

export enum StatusInscricao {
  ATIVO = 'ATIVO',
  TRANCADO = 'TRANCADO',
  CANCELADO = 'CANCELADO'
}

@Entity('inscricao_turma')
export class InscricaoTurma {
  @PrimaryGeneratedColumn('uuid')
  id_inscricao!: string;

  @ManyToOne(() => Aluno, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aluno' })
  aluno!: Aluno;

  @ManyToOne(() => Turma, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_turma' })
  turma!: Turma;

  @CreateDateColumn({ type: 'date' })
  data_inscricao!: Date;

@Column({
    type: 'enum',
    enum: StatusInscricao,
    default: StatusInscricao.ATIVO
  })
  status!: StatusInscricao;
}