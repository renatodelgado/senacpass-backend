import { Router } from 'express'
import { LogAcessoController } from '../controllers/logacessosControllers'

const routes = Router()
const controller = new LogAcessoController()

// Rota para o painel administrativo ver o histórico de batidas de cartão
routes.get('/', (req, res) => controller.listar(req, res))

// 🔥 ROTA ESSENCIAL: Endpoint que o ESP32 vai chamar via requisição HTTP POST para salvar o log
routes.post('/', (req, res) => controller.criar(req, res))

export { routes as logAcessoRoutes }