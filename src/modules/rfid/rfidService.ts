import { AppDataSource } from '../../shared/infra/database/data-source'
import { RegistroPresenca, StatusPresenca } from '../registrospresencas/entities/RegistroPresenca'
import { AulaRepository } from '../aulas/repositories/AulaRepository'
import { PresencaRepository } from '../registrospresencas/repositories/registrospresencasRepositories'
import { LogAcessoRepository } from '../logacessos/repositories/logacessosRepositories'
import { Aluno } from '../alunos/entities/Aluno'

export class RfidService {
  private aulaRepo = new AulaRepository()
  private presencaRepo = new PresencaRepository()
  private logRepo = new LogAcessoRepository()

  async processarRFID(rfid_uid: string, id_dispositivo?: string) {
    const now = new Date()

    // 1. buscar aluno
    const aluno = await AppDataSource.getRepository(Aluno).findOne({
      where: { rfid_uid }
    })

    if (!aluno) {
      throw new Error('Aluno não encontrado')
    }

    // 2. buscar aula ativa (por horário)
    const aula = await this.aulaRepo.buscarAulaAtiva()

    if (!aula) {
      return {
        tipo: 'IGNORADO',
        mensagem: 'Nenhuma aula ativa no momento'
      }
    }

    // 3. log de acesso
    await this.logRepo.create({
      rfid_uid,
      dispositivo: id_dispositivo ? { id_dispositivo } as any : null,
      tipo_evento: 'RFID_LEITURA'
    })

    // 4. buscar presença existente
    let presenca = await this.presencaRepo.findByAlunoAula(
      aluno.id_aluno,
      aula.id_aula
    )

    const toleranciaAtrasoMin = 30

    const inicioAula = new Date(aula.horario_inicio_previsto)
    const fimAula = new Date(aula.horario_fim_previsto)

    const atrasoMin = Math.floor((now.getTime() - inicioAula.getTime()) / 60000)

    const faltouParteFinal =
      (fimAula.getTime() - now.getTime()) / 60000 >= 30

    // 🚨 DUPLICIDADE TOTAL (já finalizado)
    if (presenca?.horario_checkin && presenca?.horario_checkout) {
      return {
        tipo: 'IGNORADO',
        mensagem: 'Presença já finalizada',
        presenca
      }
    }

    // 🟡 CHECK-IN
    if (!presenca) {
      let status = StatusPresenca.PRESENTE

      if (atrasoMin > toleranciaAtrasoMin) {
        status = StatusPresenca.ATRASADO
      }

      presenca = await this.presencaRepo.create({
        aluno,
        aula,
        horario_checkin: now,
        status
      })

      return {
        tipo: 'CHECKIN',
        mensagem:
          status === StatusPresenca.ATRASADO
            ? 'Check-in com atraso'
            : 'Check-in realizado',
        presenca
      }
    }

    // 🟢 CHECK-OUT
    if (presenca && !presenca.horario_checkout) {
      presenca.horario_checkout = now

      const diffMs =
        presenca.horario_checkout.getTime() -
        presenca.horario_checkin.getTime()

      const minutos = Math.floor(diffMs / 60000)

      presenca.tempo_permanencia_minutos = minutos

      // 🚨 REGRA DE FALTA POR SAÍDA ANTECIPADA
      if (faltouParteFinal) {
        presenca.status = StatusPresenca.AUSENTE
      } else if (presenca.status !== StatusPresenca.ATRASADO) {
        presenca.status = StatusPresenca.PRESENTE
      }

      await this.presencaRepo.save(presenca)

      return {
        tipo: 'CHECKOUT',
        mensagem: 'Check-out registrado com sucesso',
        presenca
      }
    }

    return {
      tipo: 'IGNORADO',
      mensagem: 'Registro já processado',
      presenca
    }
  }
}