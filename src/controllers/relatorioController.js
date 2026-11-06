import Venda from '../models/Venda.js';

export async function relatorioVendas(req, res) {
  try {
    const vendas = await Venda.find().lean();

    let faturamento = 0;
    let unidadesVendidas = 0;

    for (const venda of vendas) {
      for (const item of venda.itens) {
        unidadesVendidas += item.quantidade;
        faturamento += item.quantidade * item.precoUnitario;
      }
    }

    return res.json({
      totalVendas: vendas.length,
      faturamento: Number(faturamento.toFixed(2)),
      unidadesVendidas
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao gerar relatório', detalhe: err.message });
  }
}