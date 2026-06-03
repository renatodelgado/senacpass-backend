import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Aluno } from '../../alunos/entities/Aluno';
import { Aula } from '../../aulas/entities/Aula';

export enum StatusPresenca {
  PRESENTE = 'PRESENTE',
  AUSENTE = 'AUSENTE',
  JUSTIFICADO = 'JUSTIFICADO',
  ATRASADO = 'ATRASADO'
}

@Entity('registro_presenca')
export class RegistroPresenca {
  @PrimaryGeneratedColumn('uuid')
  id_presenca!: string;

  @ManyToOne(() => Aluno, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aluno' })
  aluno!: Aluno;

  @ManyToOne(() => Aula, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aula' })
  aula!: Aula;

  @Column({ type: 'timestamp', nullable: true })
  horario_checkin!: Date;

  @Column({ type: 'timestamp', nullable: true })
  horario_checkout!: Date;

  @Column({ type: 'int', default: 0 })
  tempo_permanencia_minutos!: number;

  @Column({
    type: 'enum',
    enum: StatusPresenca,
    default: StatusPresenca.AUSENTE
  })
  status!: StatusPresenca;

  @Column({ type: 'text', nullable: true })
  justificativa_manual!: string;
}