import { Router } from 'express'
import { PresencaController } from '../controllers/registrospresencasControllers'

const routes = Router()
const controller = new PresencaController()

routes.get('/', controller.listar)
routes.get('/:id', controller.buscar)
routes.post('/', controller.criar)

export { routes as presencaRoutes }