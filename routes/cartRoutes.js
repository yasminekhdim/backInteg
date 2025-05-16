const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Commande = require("../models/Commande");

// @route   POST /api/cart/commander
// @desc    Enregistrer une commande après authentification
// @access  Private
router.post("/commander", authenticate, async (req, res) => {
  try {
    const { panier, total } = req.body;

    if (!panier || panier.length === 0) {
      return res.status(400).json({ error: "Le panier est vide." });
    }

    const nouvelleCommande = new Commande({
      utilisateur: req.user._id,
      livres: panier.map(item => ({
        livreId:item.livreId || item._id,
        titre: item.titre,
        prix: item.prix,
        quantite: item.quantite
      })),
      total,
      date: new Date()
    });

    await nouvelleCommande.save();

    res.status(201).json({ message: "✅ Commande enregistrée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la commande :", error);
    res.status(500).json({ error: "Erreur serveur lors de la commande." });
  }
});

module.exports = router;