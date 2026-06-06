/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from 'express';
import {AlunoService} from '../services/AlunoService';
import {AlunoRepository} from '../repositories/AlunoRepository';

export class AlunoController {
    private alunoService: AlunoService;

    constructor() {
        this.alunoService = new AlunoService(new AlunoRepository());
    }

    listarTodos = async (req: Request, res: Response): Promise<Response> => {
        const alunos = await this.alunoService.listarTodos()
        return res.json(alunos)
    }

    buscarPorId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const aluno = await this.alunoService.buscarPorId(req.params.id as string)
            return res.json(aluno)
        } catch (error: any) {
            return res.status(404).json({ error: error.message })
        }
    }

    criarAluno = async (req: Request, res: Response): Promise<Response> => {
        try {
            const aluno = await this.alunoService.criarAluno(req.body)
            return res.status(201).json(aluno)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

    atualizarAluno = async (req: Request, res: Response): Promise<Response> => {
        try {
            const aluno = await this.alunoService.atualizarAluno(req.params.id as string, req.body)
            return res.json(aluno)
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

    deletarAluno = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.alunoService.deletarAluno(req.params.id as string)
            return res.status(204).send()
        } catch (error: any) {
            return res.status(400).json({ error: error.message })
        }
    }

}