import { Turma } from '../entities/Turma'

export interface ITurmaRepository {
  findById(id: string): Promise<Turma | null>
  findByCodigo(codigo: string): Promise<Turma | null>
  findAll(): Promise<Turma[]>
  findByProfessor(id_professor: string): Promise<Turma[]>
  create(data: Partial<Turma>): Promise<Turma>
  save(turma: Turma): Promise<Turma>
  delete(id: string): Promise<void>
}