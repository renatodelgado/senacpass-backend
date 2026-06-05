import { AppDataSource } from '../../../shared/infra/database/data-source'
import { Dispositivo } from '../entities/Dispositivo'

export class DispositivoRepository {
  private repo = AppDataSource.getRepository(Dispositivo)

  findAll() {
    return this.repo.find()
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id_dispositivo: id } })
  }

  findByHardware(id_hardware: string) {
    return this.repo.findOne({ where: { id_hardware } })
  }

  create(data: Partial<Dispositivo>) {
    const obj = this.repo.create(data)
    return this.repo.save(obj)
  }

  save(data: Dispositivo) {
    return this.repo.save(data)
  }

  delete(id: string) {
    return this.repo.delete({ id_dispositivo: id })
  }
}