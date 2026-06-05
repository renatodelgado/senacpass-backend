import {Aluno} from '../entities/Aluno';

export interface IAlunoRepository {
    findById(id: string): Promise<Aluno | null>;
    findByEmail(email: string): Promise<Aluno | null>;
    findByMatricula(matricula: string): Promise<Aluno | null>;
    findAll(): Promise<Aluno[]>;
    create(data: Partial<Aluno>): Promise<Aluno>;
    save(aluno: Aluno): Promise<Aluno>;
    delete(id: string): Promise<void>;
}