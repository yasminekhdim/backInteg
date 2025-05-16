const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  livres: [
    {
      livreId: String,
      titre: String,
      prix: Number,
      quantite: Number
    }
  ],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Commande", commandeSchema);
