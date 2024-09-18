const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');

const checkAuth = require('../helpers/auth').checkAuth;
const checkPermission = require('../helpers/auth').checkPermission;

router.get('/' , checkAuth, checkPermission,  AdminController.adminView);
router.get('/idea' , checkAuth, checkPermission, AdminController.ideasView);
router.get('/user' , checkAuth, checkPermission, AdminController.usersView);

module.exports = router