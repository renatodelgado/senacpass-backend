import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('professor')
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id_professor!: string

  @Column({ type: 'varchar', length: 255 })
  nome!: string

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  senha_hash!: string
}