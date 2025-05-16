const Collection = require('../models/collection');
const Livre = require('../models/book'); // ← Import du modèle Livre

// Récupérer toutes les collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des collections.' });
  }
};

// Récupérer une collection par ID
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée.' });
    }
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la collection.' });
  }
};

// ✅ Récupérer tous les livres d'une collection
exports.getLivresByCollectionId = async (req, res) => {
  try {
    const livres = await Livre.find({ collectionRef: req.params.id });
    res.json(livres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres de la collection.' });
  }
};

// Créer une nouvelle collection
exports.createCollection = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Vérification si le nom existe déjà
    const existingCollection = await Collection.findOne({ nom });
    if (existingCollection) {
      return res.status(400).json({ message: 'Le nom de la collection existe déjà.' });
    }

    const newCollection = new Collection({ nom, description });
    const savedCollection = await newCollection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erreur lors de la création de la collection.' });
  }
};

// Mettre à jour une collection
exports.updateCollection = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true, runValidators: true }
    );
    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection non trouvée.' });
    }
    res.json(updatedCollection);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la collection.' });
  }
};

// Supprimer une collection
exports.deleteCollection = async (req, res) => {
  try {
    const deletedCollection = await Collection.findByIdAndDelete(req.params.id);
    if (!deletedCollection) {
      return res.status(404).json({ message: 'Collection non trouvée.' });
    }
    res.json({ message: 'Collection supprimée avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la collection.' });
  }
};

// Rechercher des collections (par mot clé et catégorie)
exports.searchCollections = async (req, res) => {
  try {
    const { q, categorie } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { nom: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (categorie && categorie !== 'Toutes') {
      filter.categorie = categorie;
    }

    const collections = await Collection.find(filter);
    res.json(collections);
  } catch (error) {
    console.error("Erreur lors de la recherche des collections :", error);
    res.status(500).json({ message: 'Erreur lors de la recherche des collections.' });
  }
};
