const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import du modèle User

const router = express.Router();

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Vérification des champs requis
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    // Rechercher l'utilisateur et inclure le mot de passe malgré select: false
    const user = await User.findOne({ email }).select('+mot_de_passe');
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    // Vérifier si le mot de passe est correct (avec méthode personnalisée)
    const isMatch = await user.verifierMotDePasse(mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      'secretKey', // Remplace par une vraie clé secrète dans un .env
      { expiresIn: '1h' }
    );

    // Supprimer le mot de passe avant d'envoyer l'objet user
    const userSansMotDePasse = user.toJSON();

    // Répondre avec le token et l'utilisateur
    res.json({ token, user: userSansMotDePasse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
