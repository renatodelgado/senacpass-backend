import { Router } from 'express'
import { alunoRoutes } from '../../../modules/alunos/routes/aluno.routes'
import { professorRoutes } from '../../../modules/professores/routes/professor.routes'
import { turmaRoutes } from '../../../modules/turmas/routes/turma.routes'
import { aulaRoutes } from '../../../modules/aulas/routes/aula.routes'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { rfidRoutes } from '../../../modules/rfid/rfidRoutes' 

const router = Router()

// Rota pública
router.use('/professores', professorRoutes)

// RFID (público)
router.use('/rfid', rfidRoutes)

// Rotas protegidas
router.use('/alunos', authMiddleware, alunoRoutes)
router.use('/turmas', authMiddleware, turmaRoutes)
router.use('/aulas', authMiddleware, aulaRoutes)

export { router }