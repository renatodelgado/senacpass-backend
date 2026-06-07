import 'reflect-metadata'
import { AppDataSource } from '../shared/infra/database/data-source'
import { Aluno } from '../modules/alunos/entities/Aluno'
import {
  InscricaoTurma,
  StatusInscricao
} from '../modules/inscricoesturmas/entities/InscricaoTurma'
import { Turma } from '../modules/turmas/entities/Turma'

const ID_TURMA = 'a63e0338-7b9b-426d-ac91-d106976924fb'

const ALUNOS = [
  {
    rfid_uid: '1D2A88D4091080',
    matricula_institucional: 'RFID-20260606-01',
    nome: 'Aluno RFID 01',
    email: 'aluno.rfid01@senacpass.local'
  },
  {
    rfid_uid: '1D2988D4091080',
    matricula_institucional: 'RFID-20260606-02',
    nome: 'Aluno RFID 02',
    email: 'aluno.rfid02@senacpass.local'
  }
]

async function executar(): Promise<void> {
  await AppDataSource.initialize()

  const alunoRepository = AppDataSource.getRepository(Aluno)
  const turmaRepository = AppDataSource.getRepository(Turma)
  const inscricaoRepository = AppDataSource.getRepository(InscricaoTurma)

  const turma = await turmaRepository.findOne({
    where: { id_turma: ID_TURMA }
  })

  if (!turma) {
    throw new Error(`Turma não encontrada: ${ID_TURMA}`)
  }

  const resultado = []

  for (const dados of ALUNOS) {
    let aluno = await alunoRepository.findOne({
      where: { rfid_uid: dados.rfid_uid }
    })

    if (!aluno) {
      aluno = alunoRepository.create(dados)
      aluno = await alunoRepository.save(aluno)
    }

    let inscricao = await inscricaoRepository.findOne({
      where: {
        aluno: { id_aluno: aluno.id_aluno },
        turma: { id_turma: turma.id_turma }
      },
      relations: {
        aluno: true,
        turma: true
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

    inscricao = await inscricaoRepository.save(inscricao)

    resultado.push({
      id_aluno: aluno.id_aluno,
      nome: aluno.nome,
      matricula_institucional: aluno.matricula_institucional,
      email: aluno.email,
      rfid_uid: aluno.rfid_uid,
      id_inscricao: inscricao.id_inscricao,
      id_turma: turma.id_turma,
      status_inscricao: inscricao.status
    })
  }

  console.log(JSON.stringify(resultado, null, 2))
}

executar()
  .catch(error => {
    console.error('Erro ao criar alunos RFID:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })
