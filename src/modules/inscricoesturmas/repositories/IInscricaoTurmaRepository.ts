import { InscricaoTurma } from '../entities/InscricaoTurma'

export interface IInscricaoTurmaRepository {
  findById(id: string): Promise<InscricaoTurma | null>
  findAll(): Promise<InscricaoTurma[]>
  findByAluno(id_aluno: string): Promise<InscricaoTurma[]>
  findByTurma(id_turma: string): Promise<InscricaoTurma[]>
  create(data: Partial<InscricaoTurma>): Promise<InscricaoTurma>
  save(data: InscricaoTurma): Promise<InscricaoTurma>
  delete(id: string): Promise<void>
}