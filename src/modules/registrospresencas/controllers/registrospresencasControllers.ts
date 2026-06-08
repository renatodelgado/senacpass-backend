/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { PresencaService } from '../services/registrospresencasServices'

export class PresencaController {
  private service = new PresencaService()

  listar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const presencas = await this.service.listar()
      return res.json(presencas)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar presenças', error: error.message })
    }
  }

  buscar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const presenca = await this.service.buscar(req.params.id as string)
      if (!presenca) {
        return res.status(404).json({ message: 'Registro de presença não encontrado' })
      }
      return res.json(presenca)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao buscar presença', error: error.message })
    }
  }

  // 🔥 ENDPOINT ADAPTADO PARA O ESP32
  criarAusenciaManual = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id_aluno, id_aula } = req.body

      if (!id_aluno || !id_aula) {
        return res.status(400).json({
          message: 'Os campos id_aluno e id_aula são obrigatórios.'
        })
      }

      const presenca = await this.service.criarAusenciaManual(id_aluno, id_aula)
      return res.status(201).json(presenca)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { rfid_uid, id_dispositivo } = req.body

      if (!rfid_uid) {
        return res.status(400).json({ message: 'O campo rfid_uid é obrigatório.' })
      }

      // Despacha a carga de processamento direto para o core do service
      const resultado = await this.service.registrarBatidaRFID(rfid_uid, id_dispositivo)
      
      return res.status(201).json(resultado)
    } catch (error: any) {
      // Erros de validação (aluno não achado, aula não iniciada, etc.) caem aqui com status 400
      return res.status(400).json({ message: error.message })
    }
  }

  justificar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { status, justificativa_manual } = req.body
      const presenca = await this.service.justificar(
        req.params.id as string,
        status,
        justificativa_manual
      )

      return res.json({
        mensagem: 'Falta justificada com sucesso.',
        presenca
      })
    } catch (error: any) {
      const statusCode = error.message === 'Registro de presença não encontrado.' ? 404 : 400
      return res.status(statusCode).json({ message: error.message })
    }
  }

  presencaPorAula = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id_aula } = req.params
      const presencas = await this.service.listarPorAula(id_aula as string)
      return res.json(presencas)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar presenças por aula', error: error.message })
    }
  }
}
