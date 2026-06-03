import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity('unidade_curricular')
export class UnidadeCurricular {
    
  @PrimaryGeneratedColumn('uuid')
  id_unidade_curricular!: string

  @Column({ type: 'varchar', length: 150 })
  nome!: string

  @Column({ type: 'int' })
  carga_horaria!: number
}