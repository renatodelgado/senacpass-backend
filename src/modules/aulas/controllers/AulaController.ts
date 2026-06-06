/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { AulaService } from '../services/AulaService'
import { AulaRepository } from '../repositories/AulaRepository'

export class AulaController {
  private service: AulaService

  constructor() {
    this.service = new AulaService(new AulaRepository())
  }

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    const aulas = await this.service.listarTodos()
    return res.json(aulas)
  }

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const aula = await this.service.buscarPorId(req.params.id as string)
      return res.json(aula)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  listarPorTurma = async (req: Request, res: Response): Promise<Response> => {
    const aulas = await this.service.listarPorTurma(req.params.id_turma as string)
    return res.json(aulas)
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const aula = await this.service.criar(req.body)
      return res.status(201).json(aula)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const aula = await this.service.atualizar(req.params.id as string, req.body)
      return res.json(aula)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  buscarAulaAtiva = async (req: Request, res: Response): Promise<Response> => {
  try {
    const aula = await this.service.buscarAulaAtiva()
    return res.json(aula)
  } catch (error: any) {
    return res.status(404).json({ message: error.message })
  }
}

  atualizarStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const aula = await this.service.atualizarStatus(req.params.id as string, req.body.status)
      return res.json(aula)
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