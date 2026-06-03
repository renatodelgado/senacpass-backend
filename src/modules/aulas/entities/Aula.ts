import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Turma } from '../../turmas/entities/Turma';
import { Dispositivo } from '../../dispositivos/entities/Dispositivo';

export enum StatusAula {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA'
}

@Entity('aula')
export class Aula {
  @PrimaryGeneratedColumn('uuid')
  id_aula!: string;

  @ManyToOne(() => Turma, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_turma' })
  turma!: Turma;

  @ManyToOne(() => Dispositivo, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'id_dispositivo' })
  dispositivo!: Dispositivo;

  @Column({ type: 'date' })
  data_aula!: Date;

  @Column({
    type: 'enum',
    enum: StatusAula,
    default: StatusAula.AGENDADA
  })
  status!: StatusAula;

  @Column({ type: 'time' })
  horario_inicio_previsto!: string;

  @Column({ type: 'time' })
  horario_fim_previsto!: string;
}