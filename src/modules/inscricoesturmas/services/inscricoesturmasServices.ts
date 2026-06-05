import { InscricaoTurma, StatusInscricao } from '../entities/InscricaoTurma'
import { IInscricaoTurmaRepository } from '../repositories/IInscricaoTurmaRepository'

export class InscricaoTurmaService {
  constructor(private repository: IInscricaoTurmaRepository) {}

  async listarTodos(): Promise<InscricaoTurma[]> {
    return this.repository.findAll()
  }

  async buscarPorId(id: string): Promise<InscricaoTurma> {
    const data = await this.repository.findById(id)
    if (!data) throw new Error('Inscrição não encontrada')
    return data
  }

  async listarPorAluno(id_aluno: string): Promise<InscricaoTurma[]> {
    return this.repository.findByAluno(id_aluno)
  }

  async listarPorTurma(id_turma: string): Promise<InscricaoTurma[]> {
    return this.repository.findByTurma(id_turma)
  }

  async criar(data: Partial<InscricaoTurma>): Promise<InscricaoTurma> {
    return this.repository.create(data)
  }

  async atualizar(id: string, data: Partial<InscricaoTurma>): Promise<InscricaoTurma> {
    const inscricao = await this.buscarPorId(id)
    Object.assign(inscricao, data)
    return this.repository.save(inscricao)
  }

  async atualizarStatus(id: string, status: StatusInscricao): Promise<InscricaoTurma> {
    const inscricao = await this.buscarPorId(id)
    inscricao.status = status
    return this.repository.save(inscricao)
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id)
    await this.repository.delete(id)
  }
}