import { Router } from 'express'
import { TurmaController } from '../controllers/TurmaController'

const turmaRoutes = Router()
const controller = new TurmaController()

turmaRoutes.get('/', (req, res) => controller.listarTodos(req, res))
turmaRoutes.get('/:id', (req, res) => controller.buscarPorId(req, res))
turmaRoutes.get('/professor/:id_professor', (req, res) => controller.listarPorProfessor(req, res)) // Nova Rota!
turmaRoutes.post('/', (req, res) => controller.criar(req, res))
turmaRoutes.put('/:id', (req, res) => controller.atualizar(req, res))
turmaRoutes.delete('/:id', (req, res) => controller.deletar(req, res))

export { turmaRoutes }