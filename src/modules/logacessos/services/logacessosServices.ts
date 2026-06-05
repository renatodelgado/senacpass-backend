import { LogAcessoRepository } from "../repositories/logacessosRepositories"

export class LogAcessoService {
  constructor(private repo = new LogAcessoRepository()) {}

  criar(data: any) {
    return this.repo.create(data)
  }

  listar() {
    return this.repo.findAll()
  }
}