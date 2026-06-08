import 'reflect-metadata'
import { LessThanOrEqual } from 'typeorm'
import { AppDataSource } from '../shared/infra/database/data-source'
import { Aluno } from '../modules/alunos/entities/Aluno'
import { Aula } from '../modules/aulas/entities/Aula'
import {
  InscricaoTurma,
  StatusInscricao
} from '../modules/inscricoesturmas/entities/InscricaoTurma'
import {
  RegistroPresenca,
  StatusPresenca
} from '../modules/registrospresencas/entities/RegistroPresenca'
import { Turma } from '../modules/turmas/entities/Turma'

const DADOS_ALUNO = {
  nome: 'Henrique Torres',
  rfid_uid: '5471FD03',
  matricula_institucional: 'RFID-20260608-HENRIQUE',
  email: 'henrique.torres@senacpass.local'
}

const DATA_LIMITE = new Date('2026-06-07T23:59:59.999')

function adicionarMinutos(data: Date, minutos: number): Date {
  return new Date(data.getTime() + minutos * 60_000)
}

async function executar(): Promise<void> {
  await AppDataSource.initialize()

  const resultado = await AppDataSource.transaction(async manager => {
    const alunoRepository = manager.getRepository(Aluno)
    const turmaRepository = manager.getRepository(Turma)
    const aulaRepository = manager.getRepository(Aula)
    const inscricaoRepository = manager.getRepository(InscricaoTurma)
    const presencaRepository = manager.getRepository(RegistroPresenca)

    const turmas = await turmaRepository.find()

    if (turmas.length !== 1) {
      throw new Error(
        `Era esperada exatamente uma turma, mas foram encontradas ${turmas.length}.`
      )
    }

    const turma = turmas[0]
    let aluno = await alunoRepository.findOne({
      where: { rfid_uid: DADOS_ALUNO.rfid_uid }
    })

    if (!aluno) {
      aluno = alunoRepository.create(DADOS_ALUNO)
    } else {
      Object.assign(aluno, DADOS_ALUNO)
    }

    aluno = await alunoRepository.save(aluno)

    let inscricao = await inscricaoRepository.findOne({
      where: {
        aluno: { id_aluno: aluno.id_aluno },
        turma: { id_turma: turma.id_turma }
      }
    })

    if (!inscricao) {
      inscricao = inscricaoRepository.create({
        aluno,
        turma,
        status: StatusInscricao.ATIVO
      })
    } else {
      inscricao.status = StatusInscricao.ATIVO
    }

    await inscricaoRepository.save(inscricao)

    const aulas = await aulaRepository.find({
      where: {
        turma: { id_turma: turma.id_turma },
        data_aula: LessThanOrEqual(DATA_LIMITE)
      },
      order: {
        horario_inicio_previsto: 'ASC'
      }
    })

    let presencasCriadas = 0
    let presencasAtualizadas = 0

    for (const [indice, aula] of aulas.entries()) {
      const inicio = new Date(aula.horario_inicio_previsto)
      const fim = new Date(aula.horario_fim_previsto)
      const checkin = adicionarMinutos(inicio, 2 + (indice * 3) % 9)
      const checkout = adicionarMinutos(fim, -(3 + (indice * 5) % 11))

      const existente = await presencaRepository.findOne({
        where: {
          aluno: { id_aluno: aluno.id_aluno },
          aula: { id_aula: aula.id_aula }
        }
      })

      const presenca = existente ?? presencaRepository.create({ aluno, aula })

      Object.assign(presenca, {
        aluno,
        aula,
        horario_checkin: checkin,
        horario_checkout: checkout,
        tempo_permanencia_minutos: Math.floor(
          (checkout.getTime() - checkin.getTime()) / 60_000
        ),
        status: StatusPresenca.PRESENTE,
        justificativa_manual: null
      })

      await presencaRepository.save(presenca)

      if (existente) {
        presencasAtualizadas++
      } else {
        presencasCriadas++
      }
    }

    return {
      id_aluno: aluno.id_aluno,
      nome: aluno.nome,
      rfid_uid: aluno.rfid_uid,
      matricula_institucional: aluno.matricula_institucional,
      email: aluno.email,
      id_turma: turma.id_turma,
      aulas_encontradas: aulas.length,
      presencas_criadas: presencasCriadas,
      presencas_atualizadas: presencasAtualizadas
    }
  })

  console.log(JSON.stringify(resultado, null, 2))
}

executar()
  .catch(error => {
    console.error('Erro ao criar Henrique Torres:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })
