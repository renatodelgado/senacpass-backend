import 'reflect-metadata'
import { AppDataSource } from '../shared/infra/database/data-source'
import { Aula, StatusAula } from '../modules/aulas/entities/Aula'
import { Dispositivo } from '../modules/dispositivos/entities/Dispositivo'
import { Turma } from '../modules/turmas/entities/Turma'

const DATA_AULA = '2026-06-08'
const HORARIO_INICIO = new Date('2026-06-08T19:00:00.000Z')
const HORARIO_FIM = new Date('2026-06-08T21:00:00.000Z')

async function executar(): Promise<void> {
  await AppDataSource.initialize()

  const turmaRepository = AppDataSource.getRepository(Turma)
  const dispositivoRepository = AppDataSource.getRepository(Dispositivo)
  const aulaRepository = AppDataSource.getRepository(Aula)

  const turmas = await turmaRepository.find()

  if (turmas.length !== 1) {
    throw new Error(
      `Era esperada exatamente uma turma, mas foram encontradas ${turmas.length}.`
    )
  }

  const turma = turmas[0]
  const dispositivo = await dispositivoRepository.findOne({
    where: { status: 'ATIVO' }
  })

  let aula = await aulaRepository.findOne({
    where: {
      turma: { id_turma: turma.id_turma },
      horario_inicio_previsto: HORARIO_INICIO,
      horario_fim_previsto: HORARIO_FIM
    },
    relations: {
      turma: true,
      dispositivo: true
    }
  })

  if (!aula) {
    aula = aulaRepository.create({
      turma,
      dispositivo: dispositivo ?? undefined,
      data_aula: new Date(`${DATA_AULA}T00:00:00-03:00`),
      status: StatusAula.EM_ANDAMENTO,
      horario_inicio_previsto: HORARIO_INICIO,
      horario_fim_previsto: HORARIO_FIM
    })

    aula = await aulaRepository.save(aula)
  }

  console.log(
    JSON.stringify(
      {
        id_aula: aula.id_aula,
        id_turma: turma.id_turma,
        id_dispositivo: aula.dispositivo?.id_dispositivo ?? null,
        data_aula: DATA_AULA,
        horario_inicio: '2026-06-08 16:00:00 America/Fortaleza',
        horario_fim: '2026-06-08 18:00:00 America/Fortaleza',
        status: aula.status
      },
      null,
      2
    )
  )
}

executar()
  .catch(error => {
    console.error('Erro ao criar aula:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })
