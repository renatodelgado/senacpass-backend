import { Router } from 'express'
import { PresencaController } from '../controllers/registrospresencasControllers'

const routes = Router()
const controller = new PresencaController()

routes.get('/', (req, res) => controller.listar(req, res))
routes.get('/:id', (req, res) => controller.buscar(req, res))
routes.post('/', (req, res) => controller.criar(req, res))

export { routes as presencaRoutes }