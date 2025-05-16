const User = require('../models/User');
const bcrypt = require('bcrypt');

//Créer un nouvel utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer et sauvegarder le nouvel utilisateur
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erreur lors de l\'inscription.', error: err.message });
  }
};

//Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await User.findOne({ email }).select('+mot_de_passe');
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const isMatch = await user.verifierMotDePasse(mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    await user.mettreAJourConnexion();

    res.json(user); // Tu peux ajouter un token ici si besoin
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};

//Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
};

//Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
  }
};

//Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erreur lors de la mise à jour.' });
  }
};

//Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
};