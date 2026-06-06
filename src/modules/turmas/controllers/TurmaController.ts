import { Request, Response } from 'express'
import { TurmaService } from '../services/TurmaService'
import { TurmaRepository } from '../repositories/TurmaRepository'

export class TurmaController {
  private service: TurmaService

  constructor() {
    this.service = new TurmaService(new TurmaRepository())
  }

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const turmas = await this.service.listarTodos()
      return res.json(turmas)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar turmas', error: error.message })
    }
  }

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const turma = await this.service.buscarPorId(req.params.id as string)
      return res.json(turma)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  // Novo método para integrar com a rota do painel do professor
  listarPorProfessor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const turmas = await this.service.listarPorProfessor(req.params.id_professor as string)
      return res.json(turmas)
    } catch (error: any) {
      return res.status(400).json({ message: 'Erro ao listar turmas do professor', error: error.message })
    }
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const turma = await this.service.criar(req.body)
      return res.status(201).json(turma)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const turma = await this.service.atualizar(req.params.id as string, req.body)
      return res.json(turma)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.service.deletar(req.params.id as string)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }
}