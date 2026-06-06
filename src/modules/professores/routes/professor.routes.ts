import { Router } from 'express'
import { ProfessorController } from '../controllers/ProfessorController'

const professorRoutes = Router()
const controller = new ProfessorController()

professorRoutes.post('/login', (req, res) => controller.login(req, res))
professorRoutes.get('/', (req, res) => controller.listarTodos(req, res))
professorRoutes.get('/:id', (req, res) => controller.buscarPorId(req, res))
professorRoutes.post('/', (req, res) => controller.criar(req, res))
professorRoutes.put('/:id', (req, res) => controller.atualizar(req, res))
professorRoutes.delete('/:id', (req, res) => controller.deletar(req, res))
professorRoutes.get('/:id/aulas-ativas', (req, res) => controller.buscarAulasAtivasDoProfessor(req, res))

export { professorRoutes }