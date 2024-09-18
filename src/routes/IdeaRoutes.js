const express = require('express');
const router = express.Router();

const IdeaController = require('../controllers/IdeaController');
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/' , checkAuth, IdeaController.showIdeas)
router.get('/yours' , checkAuth, IdeaController.yours)
router.get('/create' , checkAuth, IdeaController.createIdeaView)
router.post('/create', checkAuth, IdeaController.createIdea)
router.post('/delete/:id', checkAuth, IdeaController.deleteIdea)
router.get('/edit/:id', checkAuth, IdeaController.editIdeaView)
router.post('/edit/:id', checkAuth, IdeaController.editIdea)
router.post('/like/:id', checkAuth, IdeaController.likeIdea)
router.get('/:id/comment', checkAuth, IdeaController.createCommentView)
router.get('/:id/comment/edit/:commentid', checkAuth, IdeaController.editCommentView)
router.post('/comment/:id', checkAuth, IdeaController.commentIdea)
router.post('/comment/edit/:id', checkAuth, IdeaController.editComment)
router.post('/comment/delete/:id', checkAuth, IdeaController.deleteComment)

module.exports = router