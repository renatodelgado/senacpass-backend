import { Router } from 'express'
import { UnidadeCurricularController } from '../controllers/unidadescurricularesControllers'

const routes = Router()
const controller = new UnidadeCurricularController()

routes.get('/', controller.listarTodos)
routes.get('/:id', controller.buscarPorId)
routes.post('/', controller.criar)
routes.put('/:id', controller.atualizar)
routes.delete('/:id', controller.deletar)

export { routes as unidadeCurricularRoutes }