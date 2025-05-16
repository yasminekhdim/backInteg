const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
  // Common fields for all book types
  titre: { 
    type: String, 
    required: [true, 'Le titre est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  auteur: { 
    type: String, 
    required: [true, "L'auteur est obligatoire"],
    trim: true
  },
  anneePublication: { 
    type: Number, 
    required: true,
    min: [1000, 'L\'année de publication doit être valide'],
    max: [new Date().getFullYear(), 'L\'année de publication ne peut pas être dans le futur']
  },
  genre: { 
    type: String, 
    required: true,
    enum: {
      values: ['Roman', 'Policier', 'Science-Fiction', 'Fantasy', 'Biographie', 'Histoire', 'Poésie', 'Théâtre', 'Essai', 'Jeunesse'],
      message: 'Genre non valide'
    }
  },
  isbn: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v);
      },
      message: 'ISBN invalide'
    }
  },
  description: { 
    type: String,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  langue: { 
    type: String, 
    default: 'Français',
    enum: ['Français', 'Anglais', 'Espagnol', 'Arabe', 'Allemand', 'Italien']
  },
  couverture: { 
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'URL de couverture invalide'
    },
    default: 'https://via.placeholder.com/300x450?text=Couverture+non+disponible'
  },
  disponible: { 
    type: Boolean, 
    default: true 
  },
  editeur: { 
    type: String, 
    required: true 
  },
  format: { 
    type: String, 
    required: true,
    enum: {
      values: ['Papier', 'PDF', 'Audio'],
      message: 'Le format doit être Papier, PDF ou Audio'
    }
  },

  // 💰 Nouveau champ prix
  prix: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  
  // Format-specific fields
  details: {
    papier: {
      nombrePages: {
        type: Number,
        min: [1, 'Le nombre de pages doit être supérieur à 0'],
        required: function() { return this.format === 'Papier'; }
      },
      nombreExemplaires: {
        type: Number,
        default: 1,
        min: [0, 'Le nombre d\'exemplaires ne peut pas être négatif'],
        required: function() { return this.format === 'Papier'; }
      },
      edition: {
        type: String,
        required: function() { return this.format === 'Papier'; }
      }
    },
    pdf: {
      lienTelechargement: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: 'URL de téléchargement invalide'
        },
        required: function() { return this.format === 'PDF'; }
      },
      tailleFichier: {
        type: String,
        required: function() { return this.format === 'PDF'; }
      },
      nombrePages: {
        type: Number,
        min: [1, 'Le nombre de pages doit être supérieur à 0'],
        required: function() { return this.format === 'PDF'; }
      }
    },
    audio: {
      duree: {
        type: String,
        required: function() { return this.format === 'Audio'; }
      },
      lienTelechargement: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: 'URL de téléchargement invalide'
        },
        required: function() { return this.format === 'Audio'; }
      },
      tailleFichier: {
        type: String,
        required: function() { return this.format === 'Audio'; }
      },
      narrateur: {
        type: String,
        required: function() { return this.format === 'Audio'; }
      }
    }
  },
  
  critiques: [{ 
    type: String,
    maxlength: [500, 'La critique ne peut pas dépasser 500 caractères']
  }],
  collectionRef: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Collection', 
    required: true 
  },
  tags: [{ 
    type: String,
    maxlength: [20, 'Un tag ne peut pas dépasser 20 caractères']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
bookSchema.index({ titre: 'text', auteur: 'text', description: 'text' });
bookSchema.index({ format: 1, genre: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;