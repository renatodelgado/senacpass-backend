import { AppDataSource } from '../../../shared/infra/database/data-source'
import { Professor } from '../entities/Professor'
import { IProfessorRepository } from './IProfessorRepository'

export class ProfessorRepository implements IProfessorRepository {
  private repository = AppDataSource.getRepository(Professor)

  async findById(id: string): Promise<Professor | null> {
    return this.repository.findOneBy({ id_professor: id })
  }

  async findByEmail(email: string): Promise<Professor | null> {
    return this.repository.findOneBy({ email })
  }

  async findAll(): Promise<Professor[]> {
    return this.repository.find()
  }

  async create(data: Partial<Professor>): Promise<Professor> {
    const professor = this.repository.create(data)
    return this.repository.save(professor)
  }

  async save(professor: Professor): Promise<Professor> {
    return this.repository.save(professor)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id_professor: id })
  }
}