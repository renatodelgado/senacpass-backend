import { Request, Response } from 'express'
import { RfidService } from './rfidService'

export class RfidController {
  private service = new RfidService()

  processar = async (req: Request, res: Response) => {
    try {
      const { rfid_uid, id_dispositivo } = req.body

      const result = await this.service.processarRFID(
        rfid_uid,
        id_dispositivo
      )

      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({
        message: error.message
      })
    }
  }
}