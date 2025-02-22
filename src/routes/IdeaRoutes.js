import express from "express";
const router = express.Router();

import IdeaController from "../controllers/IdeaController.js";
import { checkAuth } from "../helpers/auth.js";

router.get("/", checkAuth, IdeaController.showIdeas);
router.get("/yours", checkAuth, IdeaController.yours);
router.get("/create", checkAuth, IdeaController.createIdeaView);
router.post("/create", checkAuth, IdeaController.createIdea);
router.post("/delete/:id", checkAuth, IdeaController.deleteIdea);
router.get("/edit/:id", checkAuth, IdeaController.editIdeaView);
router.post("/edit/:id", checkAuth, IdeaController.editIdea);
router.post("/like/:id", checkAuth, IdeaController.likeIdea);
router.get("/:id/comment", checkAuth, IdeaController.createCommentView);
router.get(
  "/:id/comment/edit/:commentid",
  checkAuth,
  IdeaController.editCommentView,
);
router.post("/comment/:id", checkAuth, IdeaController.commentIdea);
router.post("/comment/edit/:id", checkAuth, IdeaController.editComment);
router.post("/comment/delete/:id", checkAuth, IdeaController.deleteComment);

/**
 * @swagger
 * /idea/{id}:
 *   get:
 *     summary: Busca uma ideia específica
 *     tags: [Ideas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da ideia
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Detalhes da ideia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       404:
 *         description: Ideia não encontrada
 */
router.get("/:id", checkAuth, IdeaController.showIdea);

export default router;
