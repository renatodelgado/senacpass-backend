import {Router} from 'express';
import {AlunoController} from '../controllers/AlunoController';

const alunoRoutes = Router();
const alunoController = new AlunoController();

alunoRoutes.get('/', alunoController.listarTodos);
alunoRoutes.get('/:id', alunoController.buscarPorId);
alunoRoutes.post('/', alunoController.criarAluno);
alunoRoutes.put('/:id', alunoController.atualizarAluno);
alunoRoutes.delete('/:id', alunoController.deletarAluno);


export { alunoRoutes };