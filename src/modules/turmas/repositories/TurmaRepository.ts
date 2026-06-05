import { AppDataSource } from '../../../shared/infra/database/data-source'
import { Turma } from '../entities/Turma'
import { ITurmaRepository } from './ITurmaRepository'

export class TurmaRepository implements ITurmaRepository {
  private repository = AppDataSource.getRepository(Turma)

  async findById(id: string): Promise<Turma | null> {
    return this.repository.findOne({
      where: { id_turma: id },
      relations: {professor: true, unidade_curricular: true}
    })
  }

  async findByCodigo(codigo: string): Promise<Turma | null> {
    return this.repository.findOne({
      where: { codigo_turma: codigo },
      relations: {professor: true, unidade_curricular: true}
    })
  }

  async findAll(): Promise<Turma[]> {
    return this.repository.find({
      relations: {professor: true, unidade_curricular: true}
    })
  }

  async findByProfessor(id_professor: string): Promise<Turma[]> {
    return this.repository.find({
      where: { professor: { id_professor } },
      relations: {professor: true, unidade_curricular: true}
    })
  }

  async create(data: Partial<Turma>): Promise<Turma> {
    const turma = this.repository.create(data)
    return this.repository.save(turma)
  }

  async save(turma: Turma): Promise<Turma> {
    return this.repository.save(turma)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id_turma: id })
  }
}