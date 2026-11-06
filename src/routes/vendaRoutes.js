import { Router } from 'express';
import { criarVenda, listarVendas } from '../controllers/vendaController.js';

const router = Router();

router.post('/', criarVenda);
router.get('/', listarVendas);

export default router;