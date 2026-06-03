import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dispositivo')
export class Dispositivo {
  @PrimaryGeneratedColumn('uuid')
  id_dispositivo!: string;

  @Column({ type: 'varchar', unique: true })
  id_hardware!: string;

  @Column({ type: 'varchar', nullable: true })
  localizacao!: string;

  @Column({ type: 'varchar', nullable: true })
  ip!: string;

  @Column({ type: 'varchar', default: 'ATIVO' })
  status!: string;

  @Column({ type: 'timestamp', nullable: true })
  ultima_conexao!: Date;
}