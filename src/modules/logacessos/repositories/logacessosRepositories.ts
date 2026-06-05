import { AppDataSource } from '../../../shared/infra/database/data-source'
import { LogAcesso } from '../entities/LogAcesso'

export class LogAcessoRepository {
  private repo = AppDataSource.getRepository(LogAcesso)

  create(data: Partial<LogAcesso>) {
    const obj = this.repo.create(data)
    return this.repo.save(obj)
  }

  findAll() {
    return this.repo.find({
      relations: {
        dispositivo: true
      }
    })
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id_log: id },
      relations: {
        dispositivo: true
      }
    })
  }
}