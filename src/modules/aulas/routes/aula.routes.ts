import { Router } from 'express'
import { AulaController } from '../controllers/AulaController'

const aulaRoutes = Router()
const controller = new AulaController()

aulaRoutes.get('/', controller.listarTodos)
aulaRoutes.get('/:id', controller.buscarPorId)
aulaRoutes.get('/turma/:id_turma', controller.listarPorTurma)
aulaRoutes.post('/', controller.criar)
aulaRoutes.put('/:id', controller.atualizar)
aulaRoutes.patch('/:id/status', controller.atualizarStatus)
aulaRoutes.delete('/:id', controller.deletar)

export { aulaRoutes }