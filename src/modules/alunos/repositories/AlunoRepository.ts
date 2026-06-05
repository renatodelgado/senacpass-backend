import {AppDataSource} from "../../../shared/infra/database/data-source"
import {Aluno} from "../entities/Aluno";
import {IAlunoRepository} from "./IAlunoRepository";

export class AlunoRepository implements IAlunoRepository {
    private repository = AppDataSource.getRepository(Aluno)

    async findById(id: string): Promise<Aluno | null> {
        return await this.repository.findOneBy({ id_aluno: id })
    }

    async findByEmail(email: string): Promise<Aluno> {
        const aluno = await this.repository.findOneBy({ email });
        if (!aluno) {
            throw new Error('Email não encontrado');
        }
        return aluno;
    }

    async findByMatricula(matricula: string): Promise<Aluno | null> {
        return await this.repository.findOneBy({ matricula_institucional: matricula })
    }

    async findAll(): Promise<Aluno[]> {
        return await this.repository.find()
    }

    async create(data: Partial<Aluno>): Promise<Aluno> {
        const aluno = this.repository.create(data)
        return await this.repository.save(aluno)
    }

    async save(aluno: Aluno): Promise<Aluno> {
        return await this.repository.save(aluno)
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete({ id_aluno: id })
    }
}