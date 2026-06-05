import { UnidadeCurricular } from '../entities/UnidadeCurricular'
import { IUnidadeCurricularRepository } from '../repositories/IUnidadeCurricularRepository'

export class UnidadeCurricularService {
  constructor(private repository: IUnidadeCurricularRepository) {}

  async listarTodos(): Promise<UnidadeCurricular[]> {
    return this.repository.findAll()
  }

  async buscarPorId(id: string): Promise<UnidadeCurricular> {
    const data = await this.repository.findById(id)
    if (!data) throw new Error('Unidade curricular não encontrada')
    return data
  }

  async criar(data: Partial<UnidadeCurricular>): Promise<UnidadeCurricular> {
    return this.repository.create(data)
  }

  async atualizar(id: string, data: Partial<UnidadeCurricular>): Promise<UnidadeCurricular> {
    const unidade = await this.buscarPorId(id)
    Object.assign(unidade, data)
    return this.repository.save(unidade)
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id)
    await this.repository.delete(id)
  }
}