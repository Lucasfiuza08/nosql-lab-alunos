import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoUnitario: { type: Number, required: true, min: 0 }
}, { _id: false });

const vendaSchema = new mongoose.Schema({
  cliente: { type: String, required: true, trim: true },
  data: { type: Date, default: Date.now },
  itens: {
    type: [itemSchema],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'A venda precisa ter pelo menos um item'
    }
  }
}, { timestamps: true });

export default mongoose.model('Venda', vendaSchema);