import { DispositivoRepository } from "../repositories/dispositivosRepositories"

export class DispositivoService {
  constructor(private repo = new DispositivoRepository()) {}

  listar() {
    return this.repo.findAll()
  }

  buscar(id: string) {
    return this.repo.findById(id)
  }

  criar(data: any) {
    return this.repo.create(data)
  }

  atualizar(id: string, data: any) {
    return this.repo.save({ ...data, id_dispositivo: id })
  }

  deletar(id: string) {
    return this.repo.delete(id)
  }
}