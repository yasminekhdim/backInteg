const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

//Récupérer toutes les collections
router.get('/', collectionController.getAllCollections); // GET /api/collections/
//Rechercher une collection
router.get('/search', collectionController.searchCollections);
//Récupérer une collection par ID
router.get('/:id', collectionController.getCollectionById); // GET /api/collections/:id

//Créer une nouvelle collection
router.post('/', collectionController.createCollection); // POST /api/collections/

//Mettre à jour une collection existante
router.put('/:id', collectionController.updateCollection); // PUT /api/collections/:id

//Supprimer une collection
router.delete('/:id', collectionController.deleteCollection); // DELETE /api/collections/:id

module.exports = router;