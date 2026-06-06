import { Request, Response } from 'express'
import { ProfessorService } from '../services/ProfessorService'
import { ProfessorRepository } from '../repositories/ProfessorRepository'
import { Aula } from '@modules/aulas/entities/Aula'
import { AppDataSource } from '../../../shared/infra/database/data-source'

export class ProfessorController {
  private service: ProfessorService

  constructor() {
    this.service = new ProfessorService(new ProfessorRepository())
  }

  listarTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professores = await this.service.listarTodos()
      return res.json(professores)
    } catch (error: any) {
      return res.status(500).json({ message: 'Erro ao listar professores', error: error.message })
    }
  }

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professor = await this.service.buscarPorId(req.params.id as string)
      const { senha_hash, ...resto } = professor
      return res.json(resto)
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professor = await this.service.criar(req.body)
      return res.status(201).json(professor)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, senha } = req.body
      const resultado = await this.service.login(email, senha)
      return res.json(resultado)
    } catch (error: any) {
      return res.status(401).json({ message: error.message })
    }
  }

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professor = await this.service.atualizar(req.params.id as string, req.body)
      const { senha_hash, ...resto } = professor
      return res.json(resto)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  deletar = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.service.deletar(req.params.id as string)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({ message: error.message })
    }
  }

  async buscarAulasAtivasDoProfessor(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const aulasAtivas = await AppDataSource
        .getRepository(Aula)
        .createQueryBuilder('aula')
        .innerJoinAndSelect('aula.turma', 'turma')
        .where('aula.status = :status', { status: 'EM_ANDAMENTO' })
        .andWhere('turma.professor = :idProfessor', { idProfessor: id })
        .getMany();

      return res.json(aulasAtivas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar aulas ativas do professor', error: error.message });
    }
  }

  
}