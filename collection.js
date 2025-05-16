const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String }
}, {
  timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;