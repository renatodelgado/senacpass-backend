import { Request, Response } from 'express'
import { LogAcessoService } from '../services/logacessosServices'

export class LogAcessoController {
  private service = new LogAcessoService()

  listar = async (req: Request, res: Response) => {
    res.json(await this.service.listar())
  }
}