import { RegistroPresenca } from '../entities/RegistroPresenca'
import { AppDataSource } from '../../../shared/infra/database/data-source'

export class PresencaRepository {
  private repo = AppDataSource.getRepository(RegistroPresenca)

  findAll() {
    return this.repo.find({
      relations: {
        aluno: true,
        aula: true
      }
    })
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id_presenca: id },
      relations: {
        aluno: true,
        aula: true
      }
    })
  }

  findByAlunoAula(id_aluno: string, id_aula: string) {
    return this.repo.findOne({
      where: {
        aluno: { id_aluno },
        aula: { id_aula }
      },
      relations: {
        aluno: true,
        aula: true
      }
    })
  }

  create(data: Partial<RegistroPresenca>) {
    const obj = this.repo.create(data)
    return this.repo.save(obj)
  }

  save(data: RegistroPresenca) {
    return this.repo.save(data)
  }
}