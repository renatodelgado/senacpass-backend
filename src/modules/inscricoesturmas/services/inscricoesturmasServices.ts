/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (!data.aluno || !data.turma) {
      throw new Error('Identificadores de Aluno e Turma são obrigatórios.')
    }

    // Extrai o ID do aluno e da turma tratando se vier como objeto completo ou string string formatada
    const idAluno = typeof data.aluno === 'string' ? data.aluno : (data.aluno as any).id_aluno
    const idTurmaNova = typeof data.turma === 'string' ? data.turma : (data.turma as any).id_turma

    // Busca as inscrições atuais que o aluno possui
    const inscricoesExistentes = await this.repository.findByAluno(idAluno)

    // Confere se alguma das inscrições do aluno já bate com a turma enviada
    const jaCadastrado = inscricoesExistentes.some((ins) => {
      const idTurmaAtual = typeof ins.turma === 'string' ? ins.turma : ins.turma?.id_turma
      return idTurmaAtual === idTurmaNova
    })

    if (jaCadastrado) {
      throw new Error('Este aluno já está matriculado nesta turma!')
    }

    return this.repository.create(data)
  }

  async atualizar(id: string, data: Partial<InscricaoTurma>): Promise<InscricaoTurma> {
    const src = await this.buscarPorId(id)
    Object.assign(src, data)
    return this.repository.save(src)
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