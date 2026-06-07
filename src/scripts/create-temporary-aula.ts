import 'reflect-metadata'
import { AppDataSource } from '../shared/infra/database/data-source'
import { Aula, StatusAula } from '../modules/aulas/entities/Aula'
import { Dispositivo } from '../modules/dispositivos/entities/Dispositivo'
import { Turma } from '../modules/turmas/entities/Turma'

const ID_TURMA = 'a63e0338-7b9b-426d-ac91-d106976924fb'
const ID_HARDWARE = 'ESP32-C3_Sala1104'
const ID_AULA = '2aebcbe5-f8a2-4853-966d-cd65a326a72a'
const DATA_AULA = '2026-06-06'

// O banco usa TIMESTAMP sem fuso e a API é executada em UTC.
// Estes instantes correspondem a 22:00 e 23:59 em America/Fortaleza.
const HORARIO_INICIO = new Date('2026-06-07T01:00:00.000Z')
const HORARIO_FIM = new Date('2026-06-07T02:59:00.000Z')

async function executar(): Promise<void> {
  await AppDataSource.initialize()

  const turmaRepository = AppDataSource.getRepository(Turma)
  const dispositivoRepository = AppDataSource.getRepository(Dispositivo)
  const aulaRepository = AppDataSource.getRepository(Aula)

  const turma = await turmaRepository.findOne({
    where: { id_turma: ID_TURMA }
  })

  if (!turma) {
    throw new Error(`Turma não encontrada: ${ID_TURMA}`)
  }

  const dispositivo = await dispositivoRepository.findOne({
    where: { id_hardware: ID_HARDWARE }
  })

  if (!dispositivo) {
    throw new Error(`Dispositivo não encontrado: ${ID_HARDWARE}`)
  }

  let aula = await aulaRepository.findOne({
    where: { id_aula: ID_AULA },
    relations: {
      turma: true,
      dispositivo: true
    }
  })

  if (!aula) {
    aula = aulaRepository.create({
      turma,
      dispositivo,
      data_aula: new Date(`${DATA_AULA}T00:00:00-03:00`),
      status: StatusAula.EM_ANDAMENTO,
      horario_inicio_previsto: HORARIO_INICIO,
      horario_fim_previsto: HORARIO_FIM
    })
  } else {
    aula.turma = turma
    aula.dispositivo = dispositivo
    aula.status = StatusAula.EM_ANDAMENTO
    aula.data_aula = new Date(`${DATA_AULA}T03:00:00.000Z`)
    aula.horario_inicio_previsto = HORARIO_INICIO
    aula.horario_fim_previsto = HORARIO_FIM
  }

  aula = await aulaRepository.save(aula)

  console.log(
    JSON.stringify(
      {
        id_aula: aula.id_aula,
        id_turma: turma.id_turma,
        id_dispositivo: dispositivo.id_dispositivo,
        id_hardware: dispositivo.id_hardware,
        data_aula: DATA_AULA,
        horario_inicio: '2026-06-06 22:00:00 America/Fortaleza',
        horario_fim: '2026-06-06 23:59:00 America/Fortaleza',
        horario_inicio_api: aula.horario_inicio_previsto.toISOString(),
        horario_fim_api: aula.horario_fim_previsto.toISOString(),
        status: aula.status
      },
      null,
      2
    )
  )
}

executar()
  .catch(error => {
    console.error('Erro ao criar aula temporária:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })
