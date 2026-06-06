/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aula } from '../entities/Aula'

export interface IAulaRepository {
  [x: string]: any
  findById(id: string): Promise<Aula | null>
  findAll(): Promise<Aula[]>
  findByTurma(id_turma: string): Promise<Aula[]>
  buscarAulaAtiva(): Promise<Aula | null>;
  create(data: Partial<Aula>): Promise<Aula>
  save(aula: Aula): Promise<Aula>
  delete(id: string): Promise<void>
}