import {Aluno} from '../entities/Aluno';
import {IAlunoRepository} from '../repositories/IAlunoRepository';
import {AlunoRepository} from '../repositories/AlunoRepository';

export class AlunoService {
    constructor(private alunoRepository: IAlunoRepository) {}

    async listarTodos(): Promise<Aluno[]> {
        return await this.alunoRepository.findAll();
    }

    async buscarPorId(id: string): Promise<Aluno | null> {
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        return aluno;
    }

    async criarAluno(data: Partial<Aluno>): Promise<Aluno> {
        const alunoExistente = await this.alunoRepository.findByMatricula(data.matricula_institucional!);
        if (alunoExistente) {
            throw new Error('Matrícula institucional já existe');
        }

        const emailExistente = await this.alunoRepository.findByEmail(data.email!);
        if (emailExistente) {
            throw new Error('Email já existe');
        }

        return await this.alunoRepository.create(data);

    }

    async atualizarAluno(id: string, data: Partial<Aluno>): Promise<Aluno> {
        const aluno = await this.alunoRepository.findById(id)
        if (!aluno) {
            throw new Error('Aluno não encontrado');
        }
        Object.assign(aluno, data)
        return await this.alunoRepository.save(aluno)
    }

    async deletarAluno(id: string): Promise<void> {
        await this.buscarPorId(id)
        await this.alunoRepository.delete(id)
    }

}
