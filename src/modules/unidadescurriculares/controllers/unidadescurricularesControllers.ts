/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { UnidadeCurricularService } from '../services/unidadescurricularesServices'
import { UnidadeCurricularRepository } from '../repositories/unidadescurricularesRepositories'

type IdParams = {
  id: string
}

export class UnidadeCurricularController {
  private service: UnidadeCurricularService

  constructor() {
    this.service = new UnidadeCurricularService(new UnidadeCurricularRepository())
  }

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.listarTodos()
      return res.json(data)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  buscarPorId = async (req: Request<IdParams>, res: Response): Promise<Response> => {
    try {
      const data = await this.service.buscarPorId(req.params.id)
      return res.json(data)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.criar(req.body)
      return res.status(201).json(data)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  atualizar = async (req: Request<IdParams>, res: Response): Promise<Response> => {
    try {
      const data = await this.service.atualizar(req.params.id, req.body)
      return res.json(data)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  deletar = async (req: Request<IdParams>, res: Response): Promise<Response> => {
    try {
      await this.service.deletar(req.params.id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }
}