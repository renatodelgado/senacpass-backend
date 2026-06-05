import { Request, Response } from 'express'
import { DispositivoService } from '../services/dispositivosService'

export class DispositivoController {
  private service = new DispositivoService()

  listar = async (req: Request, res: Response) => {
    res.json(await this.service.listar())
  }

  buscar = async (req: Request, res: Response) => {
    res.json(await this.service.buscar(req.params.id as string))
  }

  criar = async (req: Request, res: Response) => {
    res.status(201).json(await this.service.criar(req.body))
  }

  atualizar = async (req: Request, res: Response) => {
    res.json(await this.service.atualizar(req.params.id as string, req.body))
  }

  deletar = async (req: Request, res: Response) => {
    await this.service.deletar(req.params.id as string)
    res.status(204).send()
  }
}