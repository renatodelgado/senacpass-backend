import { Aula, StatusAula } from '../entities/Aula'
import { IAulaRepository } from '../repositories/IAulaRepository'

export class AulaService {
  constructor(private aulaRepository: IAulaRepository) {}

  async listarTodos(): Promise<Aula[]> {
    return this.aulaRepository.findAll()
  }

  async buscarPorId(id: string): Promise<Aula> {
    const aula = await this.aulaRepository.findById(id)
    if (!aula) throw new Error('Aula não encontrada')
    return aula
  }

  async listarPorTurma(id_turma: string): Promise<Aula[]> {
    return this.aulaRepository.findByTurma(id_turma)
  }

  async criar(data: Partial<Aula>): Promise<Aula> {
    return this.aulaRepository.create(data)
  }

  async atualizar(id: string, data: Partial<Aula>): Promise<Aula> {
    const aula = await this.buscarPorId(id)
    Object.assign(aula, data)
    return this.aulaRepository.save(aula)
  }

  async atualizarStatus(id: string, status: StatusAula): Promise<Aula> {
    const aula = await this.buscarPorId(id)
    aula.status = status
    return this.aulaRepository.save(aula)
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id)
    await this.aulaRepository.delete(id)
  }
}