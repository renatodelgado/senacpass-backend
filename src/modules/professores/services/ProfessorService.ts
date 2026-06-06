/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Professor } from '../entities/Professor'
import { IProfessorRepository } from '../repositories/IProfessorRepository'

export class ProfessorService {
  constructor(private professorRepository: IProfessorRepository) {}

  async listarTodos(): Promise<Omit<Professor, 'senha_hash'>[]> {
    const profesores = await this.professorRepository.findAll()
    // Ajustado o map para remover a senha de forma limpa e segura
    return profesores.map(prof => {
      const { senha_hash, ...resto } = prof
      return resto
    })
  }

  async buscarPorId(id: string): Promise<Professor> {
    const professor = await this.professorRepository.findById(id)
    if (!professor) throw new Error('Professor não encontrado')
    return professor
  }

  async criar(data: { nome: string; email: string; senha: string }): Promise<Omit<Professor, 'senha_hash'>> {
    const existente = await this.professorRepository.findByEmail(data.email)
    if (existente) throw new Error('E-mail já cadastrado')

    const senha_hash = await bcrypt.hash(data.senha, 10)
    const professor = await this.professorRepository.create({
      nome: data.nome,
      email: data.email,
      senha_hash
    })

    const { senha_hash: _, ...resto } = professor
    return resto
  }

  async login(email: string, senha: string): Promise<{ token: string }> {
    const professor = await this.professorRepository.findByEmail(email)
    if (!professor) throw new Error('Credenciais inválidas')

    const senhaCorreta = await bcrypt.compare(senha, professor.senha_hash)
    if (!senhaCorreta) throw new Error('Credenciais inválidas')

    // 🔒 Protegido contra falhas do .env usando a string padrão como fallback
    const token = jwt.sign(
      { id: professor.id_professor, email: professor.email },
      process.env.JWT_SECRET || 'chave_secreta_super_segura_tcc',
      { expiresIn: '8h' }
    )

    return { token }
  }

  async atualizar(id: string, data: Partial<{ nome: string; email: string }>): Promise<Professor> {
    const professor = await this.buscarPorId(id)
    Object.assign(professor, data)
    return this.professorRepository.save(professor)
  }

  async deletar(id: string): Promise<void> {
    await this.buscarPorId(id)
    await this.professorRepository.delete(id)
  }

  async listarAulasAtivas(id: string): Promise<any[]> {
    const professor = await this.buscarPorId(id)
    return this.professorRepository.findAulasAtivas(professor.id_professor)
  }
  
}