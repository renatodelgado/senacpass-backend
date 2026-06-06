import { Router } from 'express'
import { InscricaoTurmaController } from '../controllers/inscricoesturmasControllers'

const routes = Router()
const controller = new InscricaoTurmaController()

routes.get('/', (req, res) => controller.listarTodos(req, res))
routes.get('/:id', (req, res) => controller.buscarPorId(req, res))
routes.get('/aluno/:id_aluno', (req, res) => controller.listarPorAluno(req, res))
routes.get('/turma/:id_turma', (req, res) => controller.listarPorTurma(req, res))
routes.post('/', (req, res) => controller.criar(req, res))
routes.patch('/:id/status', (req, res) => controller.atualizarStatus(req, res))
routes.delete('/:id', (req, res) => controller.deletar(req, res))

export { routes as inscricaoTurmaRoutes }