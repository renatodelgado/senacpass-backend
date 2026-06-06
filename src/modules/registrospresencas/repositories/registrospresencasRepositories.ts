import { RegistroPresenca } from '../entities/RegistroPresenca'
import { AppDataSource } from '../../../shared/infra/database/data-source'

export class PresencaRepository {
  private repo = AppDataSource.getRepository(RegistroPresenca)

  async findAll(): Promise<RegistroPresenca[]> {
    return this.repo.find({
      relations: {
        aluno: true,
        aula: true
      }
    })
  }

  async findById(id: string): Promise<RegistroPresenca | null> {
    return this.repo.findOne({
      where: { id_log: id } as any, // Ajuste sutil caso a PK na entidade mude de nome
      relations: {
        aluno: true,
        aula: true
      }
    })
  }

  async findByAlunoAula(id_aluno: string, id_aula: string): Promise<RegistroPresenca | null> {
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

  async create(data: Partial<RegistroPresenca>): Promise<RegistroPresenca> {
    const obj = this.repo.create(data)
    return this.repo.save(obj)
  }

  async save(data: RegistroPresenca): Promise<RegistroPresenca> {
    return this.repo.save(data)
  }
}