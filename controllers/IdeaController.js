const Idea = require('../models/Idea');
const IdeaComment = require('../models/IdeaComment');
const IdeaLike = require('../models/IdeaLike');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class IdeasController {
    static async showIdeas(req, res) {
        const userId = req.session.userId;

        if (!userId) {
            req.flash('message', 'Please, login first!');
            return res.redirect('/login')
        }

        let search = req.query.search
        if (!search) {
            search = ''
        }

        const ideas = await Idea.findAll({
            include: User,
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { tags: { [Op.like]: `%${search}%` } }
                ]
            },
        })
        
        const ideasList = ideas.map((idea) => idea.get({ plain: true }));
        res.render('idea/home', { ideasList, userId, search });
    }

    static async yours(req, res) {
        const userId = req.session.userId

        const user = await User.findOne({
            where: { id: userId },
            include: Idea,
            plain: true,
        });
        if (!user) {
            res.redirect('/login')
        }
        if (!user.ideas) {
            return res.render('idea/yours', { empty: true })
        }

        const ideas = user.ideas.map((idea) => idea.dataValues)

        const ideasByDate = {};

        ideas.forEach((idea) => {
            const date = new Date(idea.createdAt).toLocaleDateString('pt-BR');
    
            if (ideasByDate[date]) {
                ideasByDate[date]++;
            } else {
                ideasByDate[date] = 1;
            }
        });

        const labels = Object.keys(ideasByDate); 
        const data = Object.values(ideasByDate);

        let empty = ideas.length === 0
        res.render('idea/yours' , { ideas, empty, labels, data })
    }

    static async createIdeaView(req, res) {
        res.render('idea/form')
    }

    static async createIdea(req, res) {
        const idea = {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            userId: req.session.userId
        }
        try {
            await Idea.create(idea)

            req.flash('message', 'Idea created successfully!')

            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteIdea(req, res) {
        const id = req.params.id
        const idea = await Idea.findOne({ where: { id: id } })

        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }

        if (idea.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot delete this idea!')
            res.redirect('/idea/yours')
        }

        try {
            await idea.destroy()
            req.flash('message', 'Idea deleted successfully!')

            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async editIdeaView(req, res) {
        const id = req.params.id
        const idea = await Idea.findOne({ where: { id: id }, raw: true })
        if (!idea) {
            rqs.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }

        if (idea.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot edit this idea!')
            res.redirect('/idea/yours')
        }
        res.render('idea/form', { idea })
    }

    static async editIdea(req, res) {
        const id = req.params.id
        const idea = await Idea.findOne({ where: { id: id }})
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }

        if (idea.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot edit this idea!')
            res.redirect('/idea/yours')
        }

        idea.title = req.body.title
        idea.description = req.body.description
        idea.tags = req.body.tags
        
        try {
            await idea.save()
            req.flash('message', 'Idea updated successfully!')

            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async likeIdea(req, res) {
        const id = req.params.id
        const redirectUrl = req.headers.referer
        const idea = await Idea.findOne({ where: { id: id }})
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect(redirectUrl)
        }
        const userId = req.session.userId
        const user = await User.findOne({ where: { id: userId }})
        if (!user) {
            req.flash('message', 'User not found')
            res.redirect(redirectUrl)
        }
        const ideaLike = await IdeaLike.findOne({ where: { ideaId: id, userId: userId }})

        if (!ideaLike) {
            await IdeaLike.create({ ideaId: id, userId: userId })
        } else {
            await ideaLike.destroy()
        }
        res.redirect(redirectUrl)
    }

    static async createCommentView(req, res) {
        const id = req.params.id
        const idea = await Idea.findOne({where: { id: id }, raw: true} )
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }
        const comments = await IdeaComment.findAll({ where: { ideaId: id }, raw: true })
        res.render('idea/comment_form' , { idea, comments })
    }

    static async editCommentView(req, res) {
        const id = req.params.id;
        const commentId = req.params.commentid
        const idea = await Idea.findOne({ where: { id: id }, raw: true})
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }
        

        const comment = await IdeaComment.findOne({ where: { id: commentId }, raw: true})
        if (!comment) {
            req.flash('message', 'Comment not found')
            res.redirect('/idea/yours')
        }

        if (comment.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot edit this comment!')
            res.redirect('/idea/yours')
        }   

        const comments = await IdeaComment.findAll({ where: { ideaId: id }, raw: true })
        
        res.render('idea/comment_form' , { idea, editingComment: comment, comments })
    }

    static async commentIdea(req, res) {
        const id = req.body.ideaId
        const idea = await Idea.findOne({ where: { id: id }})
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }
        try{
            await IdeaComment.create({ ideaId: id, userId: req.session.userId, description: req.body.description })
            req.flash('message', 'Comment created successfully!')
            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        }
        catch(error) {
            console.log(error)
        } 
    }

    static async editComment(req, res) {
        const id = req.body.ideaId
        const idea = await Idea.findOne({ where: { id: id }})
        const commentId = req.params.id
        if (!idea) {
            req.flash('message', 'Idea not found')
            res.redirect('/idea/yours')
        }
        const comment = await IdeaComment.findOne({ where: { id: commentId }})
        if (!comment) {
            req.flash('message', 'Comment not found')
            res.redirect('/idea/yours')
        }

        if (comment.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot edit this comment!')
            res.redirect('/idea/yours')
        }
        comment.description = req.body.description
        try{
            await comment.save()
            req.flash('message', 'Comment updated successfully!')
            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        }
        catch(error) {
            console.log(error)
        } 
    }

    static async deleteComment(req, res) {
        const id = req.params.id
        const comment = await IdeaComment.findOne({ where: { id: id }})
        if (!comment) {
            req.flash('message', 'Comment not found')
            res.redirect('/idea/yours')
        }

        if (comment.userId != req.session.userId && req.session.userType != 'admin' && req.session.userType != 'root') {
            req.flash('message', 'Unauthorized, you cannot delete this comment!')
            res.redirect('/idea/yours')
        }

        try{
            await comment.destroy()
            req.flash('message', 'Comment deleted successfully!')
            req.session.save(() => {
                res.redirect('/idea/yours')
            })
        }
        catch(error) {
            console.log(error)
        } 
    }
}