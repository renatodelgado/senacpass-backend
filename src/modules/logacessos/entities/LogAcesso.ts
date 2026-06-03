import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Dispositivo } from '../../dispositivos/entities/Dispositivo';

@Entity('log_acesso')
export class LogAcesso {
  @PrimaryGeneratedColumn('uuid')
  id_log!: string;

  @Column({ type: 'varchar' })
  rfid_uid!: string;

  @ManyToOne(() => Dispositivo, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'id_dispositivo' })
  dispositivo!: Dispositivo;

  @CreateDateColumn({ type: 'timestamp' })
  data_hora!: Date;

  @Column({ type: 'varchar', length: 50 })
  tipo_evento!: string;
}