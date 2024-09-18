const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/login' , AuthController.loginView);
router.post('/login' , AuthController.login);
router.get('/register' , AuthController.registerView);
router.post('/register' , AuthController.register);
router.get('/logout' , checkAuth, AuthController.logout);

module.exports = router