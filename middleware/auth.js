const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: 'Accès refusé, token manquant' });

  try {
    const decoded = jwt.verify(token, 'secretKey'); // idéalement depuis process.env.JWT_SECRET
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = authenticate;
