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

  async atualizar(id: string, data: any) {
    const dispositivo = await this.repo.findById(id);
    if (!dispositivo) {
      throw new Error('Dispositivo não encontrado');
    }
    Object.assign(dispositivo, data);
    return this.repo.save(dispositivo);
  }

  deletar(id: string) {
    return this.repo.delete(id)
  }
}