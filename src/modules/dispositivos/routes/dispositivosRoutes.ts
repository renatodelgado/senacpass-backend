import { Router } from 'express'
import { DispositivoController } from '../controllers/dispositivosController'

const routes = Router()
const controller = new DispositivoController()

routes.get('/', controller.listar)
routes.get('/:id', controller.buscar)
routes.post('/', controller.criar)
routes.put('/:id', controller.atualizar)
routes.delete('/:id', controller.deletar)

export { routes as dispositivoRoutes }