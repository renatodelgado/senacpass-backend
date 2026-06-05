import { AppDataSource } from '../../../shared/infra/database/data-source'
import { UnidadeCurricular } from '../entities/UnidadeCurricular'
import { IUnidadeCurricularRepository } from './IUnidadeCurricularRepository'

export class UnidadeCurricularRepository implements IUnidadeCurricularRepository {
  private repository = AppDataSource.getRepository(UnidadeCurricular)

  async findById(id: string): Promise<UnidadeCurricular | null> {
    return this.repository.findOne({
      where: { id_unidade_curricular: id }
    })
  }

  async findAll(): Promise<UnidadeCurricular[]> {
    return this.repository.find()
  }

  async create(data: Partial<UnidadeCurricular>): Promise<UnidadeCurricular> {
    const unidade = this.repository.create(data)
    return this.repository.save(unidade)
  }

  async save(data: UnidadeCurricular): Promise<UnidadeCurricular> {
    return this.repository.save(data)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id_unidade_curricular: id })
  }
}