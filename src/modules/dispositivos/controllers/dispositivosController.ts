/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { DispositivoService } from '../services/dispositivosService'

export class DispositivoController {
  private service = new DispositivoService()

  listar = async (req: Request, res: Response) => {
    try {
      const dispositivos = await this.service.listar()
      return res.json(dispositivos)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar dispositivos', error: error.message })
    }
  }

  buscar = async (req: Request, res: Response) => {
    try {
      const dispositivo = await this.service.buscar(req.params.id as string)
      
      if (!dispositivo) {
        return res.status(404).json({ message: 'Dispositivo não encontrado' })
      }
      
      return res.json(dispositivo)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao buscar dispositivo', error: error.message })
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      const dispositivo = await this.service.criar(req.body)
      return res.status(201).json(dispositivo)
    } catch (error: any) {
      return res.status(400).json({ message: 'Erro ao criar dispositivo', error: error.message })
    }
  }

  atualizar = async (req: Request, res: Response) => {
    try {
      const dispositivo = await this.service.atualizar(req.params.id as string, req.body)
      return res.json(dispositivo)
    } catch (error: any) {
      return res.status(404).json({ message: 'Dispositivo não encontrado', error: error.message })
    }
  }

  deletar = async (req: Request, res: Response) => {
    try {
      await this.service.deletar(req.params.id as string)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ message: 'Dispositivo não encontrado', error: error.message })
    }
  }
}