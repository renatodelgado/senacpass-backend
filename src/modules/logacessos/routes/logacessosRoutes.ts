import { Router } from 'express'
import { LogAcessoController } from '../controllers/logacessosControllers'

const routes = Router()
const controller = new LogAcessoController()

routes.get('/', controller.listar)

export { routes as logAcessoRoutes }