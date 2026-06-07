import 'reflect-metadata'
import { AppDataSource } from '../shared/infra/database/data-source'
import { Aluno } from '../modules/alunos/entities/Aluno'
import { Aula } from '../modules/aulas/entities/Aula'
import {
  RegistroPresenca,
  StatusPresenca
} from '../modules/registrospresencas/entities/RegistroPresenca'

const ID_TURMA = 'a63e0338-7b9b-426d-ac91-d106976924fb'
const DATA_INICIAL = '2026-06-01'
const DATA_FINAL = '2026-06-06'

const IDS_ALUNOS = [
  '9fe3fe42-e384-431a-8374-5b67f0e4b538',
  'bfaf8f65-1995-47b8-8366-cb7a6dbec28b',
  '2bc3139c-1a7f-4237-9c21-972208c863b5',
  'fe3260b9-bff7-4c05-ac84-6b393d6d7490',
  '39fb885f-97d7-4cda-8cbf-8a4452d172a3'
]

// 0: presente, 1: atrasado, 2: ausente, 3: justificado, 4: saida antecipada.
// Cada linha representa um aluno e produz um historico com perfil diferente.
const PERFIS_SITUACOES = [
  [0, 0, 2, 1, 2, 0, 2, 0, 2, 3, 0, 2, 0],
  [0, 2, 4, 2, 1, 2, 0, 2, 3, 0, 2, 1, 2],
  [2, 3, 2, 0, 2, 4, 2, 1, 2, 2, 0, 2, 4],
  [1, 0, 1, 4, 1, 2, 1, 0, 4, 2, 0, 3, 1],
  [3, 4, 0, 2, 3, 1, 4, 2, 0, 2, 2, 4, 2]
]

type DadosPresenca = Pick<
  RegistroPresenca,
  | 'horario_checkin'
  | 'horario_checkout'
  | 'tempo_permanencia_minutos'
  | 'status'
  | 'justificativa_manual'
>

function adicionarMinutos(data: Date, minutos: number): Date {
  return new Date(data.getTime() + minutos * 60_000)
}

function criarSituacao(
  aula: Aula,
  situacao: number,
  indiceAula: number,
  indiceAluno: number
): DadosPresenca {
  const inicio = new Date(aula.horario_inicio_previsto)
  const fim = new Date(aula.horario_fim_previsto)
  const variacao = indiceAula * IDS_ALUNOS.length + indiceAluno

  switch (situacao) {
    case 0: {
      const checkin = adicionarMinutos(inicio, 2 + (variacao * 7) % 17)
      const checkout = adicionarMinutos(fim, -(2 + (variacao * 11) % 16))

      return {
        horario_checkin: checkin,
        horario_checkout: checkout,
        tempo_permanencia_minutos: Math.floor(
          (checkout.getTime() - checkin.getTime()) / 60_000
        ),
        status: StatusPresenca.PRESENTE,
        justificativa_manual: null as unknown as string
      }
    }
    case 1: {
      const checkin = adicionarMinutos(inicio, 31 + (variacao * 13) % 29)
      const checkout = adicionarMinutos(fim, -(1 + (variacao * 5) % 14))

      return {
        horario_checkin: checkin,
        horario_checkout: checkout,
        tempo_permanencia_minutos: Math.floor(
          (checkout.getTime() - checkin.getTime()) / 60_000
        ),
        status: StatusPresenca.ATRASADO,
        justificativa_manual: null as unknown as string
      }
    }
    case 2:
      return {
        horario_checkin: null as unknown as Date,
        horario_checkout: null as unknown as Date,
        tempo_permanencia_minutos: 0,
        status: StatusPresenca.AUSENTE,
        justificativa_manual: null as unknown as string
      }
    case 3:
      return {
        horario_checkin: null as unknown as Date,
        horario_checkout: null as unknown as Date,
        tempo_permanencia_minutos: 0,
        status: StatusPresenca.JUSTIFICADO,
        justificativa_manual: [
          'Atestado medico apresentado.',
          'Participacao em atividade institucional.',
          'Problema de transporte informado.',
          'Compromisso familiar justificado.'
        ][variacao % 4]
      }
    default: {
      const checkin = adicionarMinutos(inicio, 1 + (variacao * 3) % 20)
      const checkout = adicionarMinutos(fim, -(31 + (variacao * 7) % 35))

      return {
        horario_checkin: checkin,
        horario_checkout: checkout,
        tempo_permanencia_minutos: Math.floor(
          (checkout.getTime() - checkin.getTime()) / 60_000
        ),
        status: StatusPresenca.AUSENTE,
        justificativa_manual: `Saida antecipada ${Math.floor(
          (fim.getTime() - checkout.getTime()) / 60_000
        )} minutos antes do fim.`
      }
    }
  }
}

async function executar(): Promise<void> {
  await AppDataSource.initialize()

  const alunoRepository = AppDataSource.getRepository(Aluno)
  const aulaRepository = AppDataSource.getRepository(Aula)
  const presencaRepository = AppDataSource.getRepository(RegistroPresenca)

  const alunos = await alunoRepository
    .createQueryBuilder('aluno')
    .where('aluno.id_aluno IN (:...ids)', { ids: IDS_ALUNOS })
    .getMany()

  if (alunos.length !== IDS_ALUNOS.length) {
    const idsEncontrados = new Set(alunos.map(aluno => aluno.id_aluno))
    const ausentes = IDS_ALUNOS.filter(id => !idsEncontrados.has(id))
    throw new Error(`Alunos nao encontrados: ${ausentes.join(', ')}`)
  }

  const alunosOrdenados = IDS_ALUNOS.map(id => {
    return alunos.find(aluno => aluno.id_aluno === id) as Aluno
  })

  const aulas = await aulaRepository
    .createQueryBuilder('aula')
    .innerJoinAndSelect('aula.turma', 'turma')
    .where('turma.id_turma = :idTurma', { idTurma: ID_TURMA })
    .andWhere('aula.data_aula BETWEEN :inicio AND :fim', {
      inicio: DATA_INICIAL,
      fim: DATA_FINAL
    })
    .orderBy('aula.horario_inicio_previsto', 'ASC')
    .getMany()

  if (aulas.length === 0) {
    throw new Error('Nenhuma aula encontrada entre 01/06/2026 e 06/06/2026.')
  }

  let criadas = 0
  let atualizadas = 0

  for (const [indiceAula, aula] of aulas.entries()) {
    for (const [indiceAluno, aluno] of alunosOrdenados.entries()) {
      const perfil = PERFIS_SITUACOES[indiceAluno]
      const situacao = perfil[indiceAula % perfil.length]
      const dados = criarSituacao(
        aula,
        situacao,
        indiceAula,
        indiceAluno
      )
      const existente = await presencaRepository.findOne({
        where: {
          aluno: { id_aluno: aluno.id_aluno },
          aula: { id_aula: aula.id_aula }
        }
      })

      const presenca = existente ?? presencaRepository.create({ aluno, aula })
      Object.assign(presenca, dados, { aluno, aula })
      await presencaRepository.save(presenca)

      if (existente) {
        atualizadas++
      } else {
        criadas++
      }
    }
  }

  console.log(
    `Seed concluido: ${aulas.length} aulas, ${criadas} presencas criadas e ${atualizadas} atualizadas.`
  )
}

executar()
  .catch(error => {
    console.error('Erro ao popular presencas:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })
