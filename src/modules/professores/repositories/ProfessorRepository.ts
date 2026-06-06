/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppDataSource } from '../../../shared/infra/database/data-source'
import { Professor } from '../entities/Professor'
import { IProfessorRepository } from './IProfessorRepository'

export class ProfessorRepository implements IProfessorRepository {
  async findAulasAtivas(id_professor: string): Promise<any[]> {
    const hasAulasRelation = this.repository.metadata.relations.some(
      relation => relation.propertyName === 'aulas'
    )

    if (!hasAulasRelation) {
      return []
    }

    const professor = await this.repository.findOne({
      where: { id_professor },
      relations: { aulas: true } as any
    })

    if (!professor || !(professor as any).aulas) {
      return []
    }

    const aulas = (professor as any).aulas as any[]

    return aulas.filter(aula => {
      if (typeof aula?.ativo === 'boolean') return aula.ativo
      if (typeof aula?.status === 'string') {
        const status = aula.status.toUpperCase()
        return status === 'ATIVA' || status === 'ATIVO' || status === 'ACTIVE'
      }
      if (aula?.data_fim) {
        return new Date(aula.data_fim) >= new Date()
      }
      return true
    })
  }
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