import { Request, Response } from 'express'
import { InscricaoTurmaService } from '../services/inscricoesturmasServices'
import { InscricaoTurmaRepository } from '../repositories/inscricoesturmasRepositories'

// Tipos dos params
type IdParams = {
  id: string
}

type AlunoParams = {
  id_aluno: string
}

type TurmaParams = {
  id_turma: string
}

export class InscricaoTurmaController {
  private service: InscricaoTurmaService

  constructor() {
    this.service = new InscricaoTurmaService(new InscricaoTurmaRepository())
  }

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.service.listarTodos()
    return res.json(data)
  }

  buscarPorId = async (
    req: Request<IdParams>,
    res: Response
  ): Promise<Response> => {
    try {
      const data = await this.service.buscarPorId(req.params.id)
      return res.json(data)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  listarPorAluno = async (
    req: Request<AlunoParams>,
    res: Response
  ): Promise<Response> => {
    const data = await this.service.listarPorAluno(req.params.id_aluno)
    return res.json(data)
  }

  listarPorTurma = async (
    req: Request<TurmaParams>,
    res: Response
  ): Promise<Response> => {
    const data = await this.service.listarPorTurma(req.params.id_turma)
    return res.json(data)
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.criar(req.body)
      return res.status(201).json(data)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  atualizarStatus = async (
    req: Request<IdParams>,
    res: Response
  ): Promise<Response> => {
    try {
      const data = await this.service.atualizarStatus(
        req.params.id,
        req.body.status
      )
      return res.json(data)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  deletar = async (
    req: Request<IdParams>,
    res: Response
  ): Promise<Response> => {
    try {
      await this.service.deletar(req.params.id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }
}