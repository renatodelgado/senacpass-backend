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

  // Novo método para expor a busca do repositório
  async listarPorProfessor(id_professor: string): Promise<Turma[]> {
    return this.turmaRepository.findByProfessor(id_professor)
  }

  async criar(data: Partial<Turma>): Promise<Turma> {
    if (!data.codigo_turma) throw new Error('O código da turma é obrigatório')
    
    const existente = await this.turmaRepository.findByCodigo(data.codigo_turma)
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