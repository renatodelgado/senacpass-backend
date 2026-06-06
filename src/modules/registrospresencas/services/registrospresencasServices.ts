import { AppDataSource } from '../../../shared/infra/database/data-source'
import { RegistroPresenca, StatusPresenca } from "../entities/RegistroPresenca" // Importado o seu Enum daqui
import { PresencaRepository } from "../repositories/registrospresencasRepositories"
import { AulaRepository } from "../../aulas/repositories/AulaRepository"
import { LogAcessoRepository } from "../../logacessos/repositories/logacessosRepositories"
import { Aluno } from "../../alunos/entities/Aluno"

export class PresencaService {
  constructor(
    private repo = new PresencaRepository(),
    private aulaRepo = new AulaRepository(),
    private logRepo = new LogAcessoRepository()
  ) {}

  async listar(): Promise<RegistroPresenca[]> {
    return this.repo.findAll()
  }

  async buscar(id: string): Promise<RegistroPresenca | null> {
    return this.repo.findById(id)
  }

  async registrarBatidaRFID(rfid_uid: string, id_dispositivo?: string): Promise<any> {
    const now = new Date()

    // 1. Busca o aluno dono do cartão RFID
    const aluno = await AppDataSource.getRepository(Aluno).findOne({
      where: { rfid_uid }
    })

    if (!aluno) {
      throw new Error('Cartão RFID não vinculado a nenhum aluno cadastrado.')
    }

    // 2. Busca se há alguma aula ativa/acontecendo agora
    const aula = await this.aulaRepo.buscarAulaAtiva()

    if (!aula) {
      await this.logRepo.create({
        rfid_uid,
        dispositivo: id_dispositivo ? { id_dispositivo } as any : null,
        tipo_evento: 'RFID_IGNORADO_SEM_AULA'
      })

      throw new Error('Nenhuma aula em andamento para esta sala no momento.')
    }

    // 3. Registra o log de leitura com sucesso
    await this.logRepo.create({
      rfid_uid,
      dispositivo: id_dispositivo ? { id_dispositivo } as any : null,
      tipo_evento: 'RFID_LEITURA'
    })

    // 4. Procura se o aluno já possui um registro aberto para esta aula
    // 💡 Mudado para const para resolver o aviso do ESLint
    const presenca = await this.repo.findByAlunoAula(aluno.id_aluno, aula.id_aula)

    // Configurações das regras de negócio (em minutos)
    const TOLERANCIA_ATRASO_MIN = 30
    const LIMITE_SAIDA_ANTECIPADA_MIN = 30 

    const inicioAula = new Date(aula.horario_inicio_previsto)
    const fimAula = new Date(aula.horario_fim_previsto)

    const minutesDesdeInicio = Math.floor((now.getTime() - inicioAula.getTime()) / 60000)
    const minutosParaFim = Math.floor((fimAula.getTime() - now.getTime()) / 60000)

    // 🚨 DUPLICIDADE: Impede processar novamente se o ciclo de entrada/saída fechou
    if (presenca?.horario_checkin && presenca?.horario_checkout) {
      return {
        tipo: 'IGNORADO',
        mensagem: 'Presença e Check-out já finalizados para esta aula.',
        presenca
      }
    }

    // 🟡 CENÁRIO: CHECK-IN
    if (!presenca) {
      // 🚨 TRAVA DE HORÁRIO: Só permite entrar se a aula já iniciou (horário correto)
      if (minutesDesdeInicio < 0) {
        throw new Error(`Check-in bloqueado. A aula iniciará em ${Math.abs(minutesDesdeInicio)} minutos.`)
      }

      // 💡 Corrigido: Agora usando estritamente o seu Enum StatusPresenca
      let statusDefinido = StatusPresenca.PRESENTE

      // Se estourar os 30 minutos tolerados, marca como atrasado
      if (minutesDesdeInicio > TOLERANCIA_ATRASO_MIN) {
        statusDefinido = StatusPresenca.ATRASADO
      }

      const novaPresenca = await this.repo.create({
        aluno,
        aula,
        horario_checkin: now,
        status: statusDefinido,
        tempo_permanencia_minutos: 0
      })

      return {
        tipo: 'CHECKIN',
        mensagem: statusDefinido === StatusPresenca.ATRASADO 
          ? `Check-in efetuado com ATRASO (${minutesDesdeInicio} min).` 
          : 'Check-in efetuado com SUCESSO.',
        presenca: novaPresenca
      }
    }

    // 🟢 CENÁRIO: CHECK-OUT
    if (presenca && !presenca.horario_checkout) {
      presenca.horario_checkout = now

      const diffMs = presenca.horario_checkout.getTime() - presenca.horario_checkin.getTime()
      presenca.tempo_permanencia_minutos = Math.floor(diffMs / 60000)

      // 💡 Corrigido: Atribuição usando o Enum correto da entidade
      if (minutosParaFim >= LIMITE_SAIDA_ANTECIPADA_MIN) {
        presenca.status = StatusPresenca.AUSENTE
      } 
      else if (presenca.status !== StatusPresenca.ATRASADO) {
        presenca.status = StatusPresenca.PRESENTE
      }

      const presencaAtualizada = await this.repo.save(presenca)

      return {
        tipo: 'CHECKOUT',
        mensagem: presenca.status === StatusPresenca.AUSENTE
          ? `Check-out salvo. Status alterado para AUSENTE devido à saída antecipada (${minutosParaFim} min antes).`
          : 'Check-out efetuado com sucesso.',
        presenca: presencaAtualizada
      }
    }


  }

  async listarPorAula(id_aula: string): Promise<RegistroPresenca[]> {
    return this.repo.findByAula(id_aula)
  }

}