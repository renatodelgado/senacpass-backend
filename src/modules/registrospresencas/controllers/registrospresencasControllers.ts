import { Request, Response } from 'express'
import { PresencaService } from '../services/registrospresencasServices'

export class PresencaController {
  private service = new PresencaService()

  listar = async (req: Request, res: Response) => {
    res.json(await this.service.listar())
  }

  buscar = async (req: Request, res: Response) => {
    res.json(await this.service.buscar(req.params.id as string))
  }

  criar = async (req: Request, res: Response) => {
    res.status(201).json(await this.service.criar(req.body))
  }
}