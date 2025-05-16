const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

// Récupérer toutes les collections
router.get('/', collectionController.getAllCollections);

// Rechercher une collection
router.get('/search', collectionController.searchCollections);

// Récupérer une collection par ID
router.get('/:id', collectionController.getCollectionById);

// ✅ Récupérer les livres appartenant à une collection
router.get('/:id/livres', collectionController.getLivresByCollectionId);

// Créer une nouvelle collection
router.post('/', collectionController.createCollection);

// Mettre à jour une collection existante
router.put('/:id', collectionController.updateCollection);

// Supprimer une collection
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
