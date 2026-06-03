import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity('aluno')
export class Aluno {
  
  @PrimaryGeneratedColumn('uuid')
  id_aluno!: string

  @Column({ type: 'varchar', length: 50, unique: true })
  matricula_institucional!: string

  @Column({ type: 'varchar', length: 50, unique: true })
  rfid_uid!: string

  @Column({ type: 'varchar', length: 255 })
  nome!: string

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string
}