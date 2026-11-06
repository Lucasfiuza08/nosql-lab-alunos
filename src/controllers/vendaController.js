import mongoose from 'mongoose';
import Venda from '../models/Venda.js';
import Produto from '../models/Produto.js';

export async function criarVenda(req, res) {
  try {
    const { cliente, data, itens } = req.body;

    if (!cliente || typeof cliente !== 'string') {
      return res.status(400).json({ erro: 'Informe o cliente' });
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ erro: 'Informe pelo menos um item' });
    }

    for (const item of itens) {
      if (!mongoose.isValidObjectId(item.produto)) {
        return res.status(400).json({ erro: `ID de produto inválido: ${item.produto}` });
      }
      if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
        return res.status(400).json({ erro: 'Quantidade deve ser um inteiro maior que zero' });
      }
    }

    const ids = [...new Set(itens.map((i) => String(i.produto)))];
    const produtos = await Produto.find({ _id: { $in: ids } });
    const mapa = new Map(produtos.map((p) => [String(p._id), p]));

    const naoEncontrados = ids.filter((id) => !mapa.has(id));
    if (naoEncontrados.length > 0) {
      return res.status(404).json({ erro: 'Produto(s) não encontrado(s)', ids: naoEncontrados });
    }

    const itensVenda = itens.map((i) => ({
      produto: i.produto,
      quantidade: i.quantidade,
      precoUnitario: mapa.get(String(i.produto)).preco
    }));

    const venda = await Venda.create({ cliente, data, itens: itensVenda });
    await venda.populate('itens.produto');

    return res.status(201).json(venda);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ erro: err.message });
    }
    return res.status(500).json({ erro: 'Erro ao registrar venda', detalhe: err.message });
  }
}

export async function listarVendas(req, res) {
  try {
    const vendas = await Venda.find()
      .populate('itens.produto')
      .sort({ data: -1 });
    return res.json(vendas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar vendas', detalhe: err.message });
  }
}