import { Router } from 'express'
import { RfidController } from './rfidController'

const routes = Router()
const controller = new RfidController()

routes.post('/', controller.processar)

export { routes as rfidRoutes }