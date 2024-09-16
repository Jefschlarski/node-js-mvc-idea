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
        
        const currentPage = parseInt(req.query.page) || 1;

        let search = req.query.search
        if (!search) {
            search = ''
        }

        const ideaListWithPagination = await Idea.getListWithPagination(currentPage, search, User);

        const ideasList = ideaListWithPagination.list;
        const totalPages = ideaListWithPagination.totalPages;
        const limit = ideaListWithPagination.limit;

        ideasList.forEach(element => {
            IdeaLike.findOne({ where: { ideaId: element.id, userId: userId } })
                .then(like => {
                    if (like) {
                        element.liked = true
                    }
                })
        });
        res.render('idea/home', { ideasList, userId, search, currentPage: currentPage, totalPages: totalPages, limit: limit});
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
        const ideasWithLike = await IdeaLike.markLikedByUser(ideas, userId)
        let empty = ideas.length === 0
        res.render('idea/yours' , { ideas: ideasWithLike, empty})
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
        try {
            const id = req.params.id;
            const idea = await Idea.findOne({ where: { id: id }});
    
            if (!idea) {
                return res.status(404).json({ success: false, message: 'Idea not found' });
            }
    
            const userId = req.session.userId;
            const user = await User.findOne({ where: { id: userId }});
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            const ideaLike = await IdeaLike.findOne({ where: { ideaId: id, userId: userId }});
    
            let liked = false;
            let likes = idea.likes;
            if (!ideaLike) {
                await IdeaLike.create({ ideaId: id, userId: userId });
                await idea.increment('likes');
                likes = idea.likes + 1;
                liked = true;
            } else {
                await ideaLike.destroy();
                await idea.decrement('likes');
                likes = idea.likes - 1;
            }
    
            return res.json({
                success: true,
                liked: liked,
                likes: likes,
                ideaId: id,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
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