const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator'); // Pour valider les emails et URL

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Veuillez fournir un email valide'
    }
  },
  mot_de_passe: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false // Ne pas retourner le mot de passe dans les requêtes
  },
  numero_telephone: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^\d{8}$/.test(v); // ✅ exactement 8 chiffres
      },
      message: 'Numéro de téléphone invalide (8 chiffres requis)'
    }
  },
  adresse: {
    type: String,
    default: '',
    maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères']
  },
  code_postal: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return v === '' || /^\d{4}$/.test(v); // ✅ exactement 4 chiffres
      },
      message: 'Code postal invalide (4 chiffres requis)'
    }
  },
  avatar_url: {
    type: String,
    default: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
    validate: {
      validator: function(v) {
        return v === '' || validator.isURL(v);
      },
      message: 'URL d\'avatar invalide'
    }
  },
  newsletter_abonne: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: {
      values: ['client', 'admin', 'moderateur'],
      message: 'Le rôle doit être client, admin ou moderateur'
    },
    default: 'client'
  },
  date_inscription: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  derniere_connexion: {
    type: Date
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['clair', 'sombre', 'systeme'],
      default: 'systeme'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// 🔐 Hash du mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Ne pas retourner le mot de passe dans les résultats JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.mot_de_passe;
  return user;
};

// ✅ Méthode de comparaison de mot de passe
userSchema.methods.verifierMotDePasse = async function(motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.mot_de_passe);
};

// Méthode pour mettre à jour la dernière connexion
userSchema.methods.mettreAJourConnexion = async function() {
  this.derniere_connexion = Date.now();
  await this.save();
};

// Index pour la recherche
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ nom: 'text', prenom: 'text' });

// ✅ Export du modèle (évite l'erreur OverwriteModelError)
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
