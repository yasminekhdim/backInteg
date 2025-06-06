const Book = require('../models/book');

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('collectionRef');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres.' });
  }
};

// Récupérer un livre par ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('collectionRef');
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du livre.' });
  }
};

// Ajouter un nouveau livre
exports.createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erreur lors de la création du livre.', errors: error.errors });
  }
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('collectionRef');

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du livre.', errors: error.errors });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    res.json({ message: 'Livre supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression du livre.' });
  }
};

// Recherche par titre ou auteur
exports.searchBooks = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ message: 'Le paramètre de recherche est requis.' });
    }

    const books = await Book.find({
      $or: [
        { titre: { $regex: searchQuery, $options: 'i' } },
        { auteur: { $regex: searchQuery, $options: 'i' } }
      ]
    });

    res.json(books);
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
    res.status(500).json({ message: 'Erreur lors de la recherche des livres.' });
  }
};
