import { AppDataSource } from '../../../shared/infra/database/data-source'
import { Aula } from '../entities/Aula'
import { IAulaRepository } from './IAulaRepository'
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

export class AulaRepository implements IAulaRepository {
  private repository = AppDataSource.getRepository(Aula)

  async findById(id: string): Promise<Aula | null> {
    return this.repository.findOne({
      where: { id_aula: id },
      relations: { turma: true, dispositivo: true }
    })
  }

  async findAll(): Promise<Aula[]> {
    return this.repository.find({
      relations: { turma: true, dispositivo: true }
    })
  }

  async findByTurma(id_turma: string): Promise<Aula[]> {
    return this.repository.find({
      where: { turma: { id_turma } },
      relations: { turma: true, dispositivo: true }
    })
  }

  async buscarAulaAtiva(): Promise<Aula | null> {
    const now = new Date()

    return this.repository.findOne({
      where: {
        horario_inicio_previsto: LessThanOrEqual(now),
        horario_fim_previsto: MoreThanOrEqual(now),
      },
      relations: {
        turma: true,
        dispositivo: true
      }
    })
  }

  async create(data: Partial<Aula>): Promise<Aula> {
    const aula = this.repository.create(data)
    return this.repository.save(aula)
  }

  async save(aula: Aula): Promise<Aula> {
    return this.repository.save(aula)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id_aula: id })
  }
}