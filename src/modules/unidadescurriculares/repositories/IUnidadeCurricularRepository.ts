import { UnidadeCurricular } from '../entities/UnidadeCurricular'

export interface IUnidadeCurricularRepository {
  findById(id: string): Promise<UnidadeCurricular | null>
  findAll(): Promise<UnidadeCurricular[]>
  create(data: Partial<UnidadeCurricular>): Promise<UnidadeCurricular>
  save(data: UnidadeCurricular): Promise<UnidadeCurricular>
  delete(id: string): Promise<void>
}