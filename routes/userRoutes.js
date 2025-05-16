const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Authentification
router.post('/register', userController.registerUser); // POST /api/users/register
router.post('/login', userController.loginUser);       // POST /api/users/login

// Gestion des utilisateurs
router.get('/', userController.getAllUsers);           // GET /api/users/
router.get('/:id', userController.getUserById);        // GET /api/users/:id
router.put('/:id', userController.updateUser);         // PUT /api/users/:id
router.delete('/:id', userController.deleteUser);      // DELETE /api/users/:id

module.exports = router;
