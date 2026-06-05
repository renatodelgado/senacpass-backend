import { Router } from 'express'
import { ProfessorController } from '../controllers/ProfessorController'

const professorRoutes = Router()
const controller = new ProfessorController()

professorRoutes.post('/login', controller.login)
professorRoutes.get('/', controller.listarTodos)
professorRoutes.get('/:id', controller.buscarPorId)
professorRoutes.post('/', controller.criar)
professorRoutes.put('/:id', controller.atualizar)
professorRoutes.delete('/:id', controller.deletar)

export { professorRoutes }