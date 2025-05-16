const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  livre: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
  quantite: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
