import { AppDataSource } from '../../../shared/infra/database/data-source'
import { InscricaoTurma } from '../entities/InscricaoTurma'
import { IInscricaoTurmaRepository } from './IInscricaoTurmaRepository'

export class InscricaoTurmaRepository implements IInscricaoTurmaRepository {
  private repository = AppDataSource.getRepository(InscricaoTurma)

  async findById(id: string): Promise<InscricaoTurma | null> {
    return this.repository.findOne({
      where: { id_inscricao: id },
      relations: { aluno: true, turma: true }
    })
  }

  async findAll(): Promise<InscricaoTurma[]> {
    return this.repository.find({
      relations: { aluno: true, turma: true }
    })
  }

  async findByAluno(id_aluno: string): Promise<InscricaoTurma[]> {
    return this.repository.find({
      where: { aluno: { id_aluno } },
      relations: { aluno: true, turma: true }
    })
  }

  async findByTurma(id_turma: string): Promise<InscricaoTurma[]> {
    return this.repository.find({
      where: { turma: { id_turma } },
      relations: { aluno: true, turma: true }
    })
  }

  async create(data: Partial<InscricaoTurma>): Promise<InscricaoTurma> {
    const inscricao = this.repository.create(data)
    return this.repository.save(inscricao)
  }

  async save(data: InscricaoTurma): Promise<InscricaoTurma> {
    return this.repository.save(data)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id_inscricao: id })
  }
}