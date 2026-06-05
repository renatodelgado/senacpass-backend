import { Router } from 'express'
import { InscricaoTurmaController } from '../controllers/inscricoesturmasControllers'

const routes = Router()
const controller = new InscricaoTurmaController()

routes.get('/', controller.listarTodos)
routes.get('/:id', controller.buscarPorId)
routes.get('/aluno/:id_aluno', controller.listarPorAluno)
routes.get('/turma/:id_turma', controller.listarPorTurma)
routes.post('/', controller.criar)
routes.patch('/:id/status', controller.atualizarStatus)
routes.delete('/:id', controller.deletar)

export { routes as inscricaoTurmaRoutes }