/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { LogAcessoService } from '../services/logacessosServices'

export class LogAcessoController {
  private service = new LogAcessoService()

  listar = async (req: Request, res: Response) => {
    try {
      const logs = await this.service.listar()
      return res.json(logs)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar logs de acesso', error: error.message })
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      // Este método vai receber os dados enviados pelo ESP32 (rfid_uid, id_dispositivo, tipo_evento)
      const novoLog = await this.service.criar(req.body)
      return res.status(201).json(novoLog)
    } catch (error: any) {
      return res.status(400).json({ message: 'Erro ao registrar log de acesso', error: error.message })
    }
  }
}