const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importation des routes
const bookRoutes = require('./routes/bookRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Importer tes routes d'authentification

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only requests from React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  credentials: true,  // Allow cookies, authorization headers, etc.
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/collections', collectionRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gestion_livres', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connecté à MongoDB');

  // Démarrage du serveur
  app.listen(5000, () => {
    console.log('Serveur démarré sur http://localhost:5000');
  });
})
.catch((error) => {
  console.error('Erreur de connexion à MongoDB :', error);
});
