/* eslint-disable @typescript-eslint/no-explicit-any */
import { Professor } from '../entities/Professor'

export interface IProfessorRepository {
  findById(id: string): Promise<Professor | null>
  findByEmail(email: string): Promise<Professor | null>
  findAll(): Promise<Professor[]>
  create(data: Partial<Professor>): Promise<Professor>
  save(professor: Professor): Promise<Professor>
  delete(id: string): Promise<void>
  findAulasAtivas(id_professor: string): Promise<any[]>

}