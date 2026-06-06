import { Router } from 'express'
import { UnidadeCurricularController } from '../controllers/unidadescurricularesControllers'

const routes = Router()
const controller = new UnidadeCurricularController()

routes.get('/', (req, res) => controller.listarTodos(req, res))
routes.get('/:id', (req, res) => controller.buscarPorId(req, res))
routes.post('/', (req, res) => controller.criar(req, res))
routes.put('/:id', (req, res) => controller.atualizar(req, res))
routes.delete('/:id', (req, res) => controller.deletar(req, res))

export { routes as unidadeCurricularRoutes }