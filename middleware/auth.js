const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Vérifie si l'en-tête d'autorisation est présent et correctement formaté
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: 'Accès refusé, token manquant ou mal formé' });
    }

    const token = authHeader.split(" ")[1];

    // Vérifie et décode le token
    const decoded = jwt.verify(token, 'secretKey'); // Remplacer par process.env.JWT_SECRET dans un vrai projet

    // Recherche de l'utilisateur correspondant dans la base de données
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    // Ajoute les infos utilisateur à la requête pour les middlewares suivants
    req.user = user;
    next();
  } catch (err) {
    // Gestion des cas spécifiques : token expiré
    if (err.name === 'TokenExpiredError') {
      console.error("Erreur middleware auth : Token expiré", err);
      return res.status(401).json({ error: 'Token expiré, veuillez vous reconnecter.' });
    }

    // Autres erreurs liées au token
    console.error("Erreur middleware auth :", err);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = authenticate;
