const Idea = require('../models/Idea');
const User = require('../models/User');
module.exports = class AdminController {

    static async adminView(req, res) {
        
        const ideas = await Idea.findAll();

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

        res.render('admin/admin', {labels, data});
    }
    static async ideasView(req, res) {
        const ideas = await Idea.findAll();
        const ideasList = ideas.map((idea) => idea.get({ plain: true }));
        res.render('admin/idea', { ideasList });
    }

    static async usersView(req, res) {
        const users = await User.findAll();
        const usersList = users.map((user) => {
            const userData = user.get({ plain: true });
            delete userData.password;
            return userData;
        });
        res.render('admin/user', { usersList });
    }
}