/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogAcessoRepository } from "../repositories/logacessosRepositories"
import { LogAcesso } from "../entities/LogAcesso"

export class LogAcessoService {
  constructor(private repo = new LogAcessoRepository()) {}

  async criar(data: any): Promise<LogAcesso> {
    // Caso o ESP32 não envie a data_hora, nós geramos o carimbo de tempo agora no servidor
    if (!data.data_hora) {
      data.data_hora = new Date()
    }
    return this.repo.create(data)
  }

  async listar(): Promise<LogAcesso[]> {
    return this.repo.findAll()
  }
}