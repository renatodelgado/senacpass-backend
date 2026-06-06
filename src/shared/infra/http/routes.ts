import { Router } from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { alunoRoutes } from '../../../modules/alunos/routes/aluno.routes'
import { professorRoutes } from '../../../modules/professores/routes/professor.routes'
import { turmaRoutes } from '../../../modules/turmas/routes/turma.routes'
import { aulaRoutes } from '../../../modules/aulas/routes/aula.routes'
import { logAcessoRoutes } from '../../../modules/logacessos/routes/logacessosRoutes'
import { unidadeCurricularRoutes } from '../../../modules/unidadescurriculares/routes/unidadescurricularesRoutes'
import { presencaRoutes } from '../../../modules/registrospresencas/routes/registrospresencasRoutes'
import { inscricaoTurmaRoutes } from '../../../modules/inscricoesturmas/routes/inscricoesturmasRoutes'
import { dispositivoRoutes } from '../../../modules/dispositivos/routes/dispositivosRoutes'

const router = Router()

// Rota pública
router.use('/log-acessos', logAcessoRoutes)
router.use('/professores', professorRoutes)
router.use('/presencas', presencaRoutes)

// Rotas protegidas
router.use('/alunos', authMiddleware, alunoRoutes)
router.use('/turmas', authMiddleware, turmaRoutes)
router.use('/aulas', authMiddleware, aulaRoutes)
router.use('/unidades-curriculares', authMiddleware, unidadeCurricularRoutes)
router.use('/inscricoes-turmas', authMiddleware, inscricaoTurmaRoutes)
router.use('/dispositivos', authMiddleware, dispositivoRoutes)

export { router }