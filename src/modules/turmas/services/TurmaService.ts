import { Turma } from '../entities/Turma'
import { ITurmaRepository } from '../repositories/ITurmaRepository'

export class TurmaService {
  constructor(private turmaRepository: ITurmaRepository) {}

  async listarTodos(): Promise<Turma[]> {
    return this.turmaRepository.findAll()
  }

  async buscarPorId(id: string): Promise<Turma> {
    const turma = await this.turmaRepository.findById(id)
    if (!turma) throw new Error('Turma não encontrada')
    return turma
  }

  async criar(data: Partial<Turma>): Promise<Turma> {
    const existente = await this.turmaRepository.findByCodigo(data.codigo_turma!)
    if (existente) throw new Error('Código de turma já cadastrado')
    return this.turmaRepository.create(data)
  }

  async atualizar(id: string, data: Partial<Turma>): Promise<Turma> {
    const turma = await this.buscarPorId(id)
    Object.assign(turma, data)
    return this.turmaRepository.save(turma)
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id)
    await this.turmaRepository.delete(id)
  }
}