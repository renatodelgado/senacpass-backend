import { Router } from 'express'
import { TurmaController } from '../controllers/TurmaController'

const turmaRoutes = Router()
const controller = new TurmaController()

turmaRoutes.get('/', controller.listarTodos)
turmaRoutes.get('/:id', controller.buscarPorId)
turmaRoutes.post('/', controller.criar)
turmaRoutes.put('/:id', controller.atualizar)
turmaRoutes.delete('/:id', controller.deletar)

export { turmaRoutes }