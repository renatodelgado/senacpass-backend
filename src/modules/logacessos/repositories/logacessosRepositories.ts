import { AppDataSource } from '../../../shared/infra/database/data-source'
import { LogAcesso } from '../entities/LogAcesso'

export class LogAcessoRepository {
  private repo = AppDataSource.getRepository(LogAcesso)

  async create(data: Partial<LogAcesso>): Promise<LogAcesso> {
    const obj = this.repo.create(data)
    return this.repo.save(obj)
  }

  async findAll(): Promise<LogAcesso[]> {
    return this.repo.find({
      relations: {
        dispositivo: true
      },
      order: {
        data_hora: 'DESC' // Organiza trazendo os acessos mais recentes primeiro
      }
    })
  }

  async findById(id: string): Promise<LogAcesso | null> {
    return this.repo.findOne({
      where: { id_log: id },
      relations: {
        dispositivo: true
      }
    })
  }
}