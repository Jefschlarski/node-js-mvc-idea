const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');

router.get('/' , AdminController.adminView);
router.get('/idea' , AdminController.ideasView);
router.get('/user' , AdminController.usersView);

module.exports = router