const Idea = require('../models/Idea');
const User = require('../models/User');
module.exports = class AdminController {

    static async adminView(req, res) {
        
        const ideas = await Idea.findAll();
        const users = await User.findAll();
        const ideaChartData = await Idea.getChartCreationData(ideas);
        const userChartData = await User.getChartCreationData(users);
        res.render('admin/admin', { ideaChartData, userChartData });
    }
    static async ideasView(req, res) {
        let search = req.query.search
        if (!search) {
            search = ''
        }
        const currentPage = parseInt(req.query.page) || 1;

        const ideaListWithPagination = await Idea.getListWithPagination(currentPage, search);
        const ideasList = ideaListWithPagination.list;
        const totalPages = ideaListWithPagination.totalPages;
        const limit = ideaListWithPagination.limit;
        res.render('admin/idea', { ideasList , currentPage: currentPage, totalPages: totalPages, limit: limit, search });
    }

    static async usersView(req, res) {
        let search = req.query.search
        if (!search) {
            search = ''
        }
        const page = parseInt(req.query.page) || 1;

        const usersListWithPagination = await User.getListWithPagination(page, search);
        const users = usersListWithPagination.list;

        const userListWithoutPassword = users.map((user) => {
            delete user.password
            return user
        }) 
        const usersList = userListWithoutPassword
        const totalPages = usersListWithPagination.totalPages;
        const limit = usersListWithPagination.limit;
        res.render('admin/user', { usersList, currentPage: page, totalPages: totalPages, limit: limit, search });
    }
}