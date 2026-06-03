import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Professor } from '../../professores/entities/Professor'
import { UnidadeCurricular } from '../../unidadescurriculares/entities/UnidadeCurricular'

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn('uuid')
  id_turma!: string

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo_turma!: string

  @ManyToOne(() => UnidadeCurricular)
  @JoinColumn({ name: 'id_unidade_curricular' })
  unidade_curricular!: UnidadeCurricular

  @ManyToOne(() => Professor)
  @JoinColumn({ name: 'id_professor' })
  professor!: Professor
}