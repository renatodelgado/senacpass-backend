import { RegistroPresenca } from "../entities/RegistroPresenca"
import { PresencaRepository } from "../repositories/registrospresencasRepositories"

export class PresencaService {
  constructor(private repo = new PresencaRepository()) {}

  listar() {
    return this.repo.findAll()
  }

  buscar(id: string) {
    return this.repo.findById(id)
  }

  criar(data: any) {
    return this.repo.create(data)
  }
}