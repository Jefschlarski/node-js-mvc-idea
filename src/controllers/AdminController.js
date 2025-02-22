import Idea from "../models/Idea.js";
import User from "../models/User.js";

class AdminController {
  static async adminView(req, res) {
    const ideas = await Idea.findAll();
    const users = await User.findAll();
    const ideaChartData = await Idea.getChartCreationData(ideas);
    const userChartData = await User.getChartCreationData(users);
    res.render("admin/admin", { ideaChartData, userChartData });
  }

  static async ideasView(req, res) {
    let search = req.query.search || "";
    let page = parseInt(req.query.page) || 1;

    const ideasListWithPagination = await Idea.getListWithPagination(
      page,
      search,
    );
    const ideas = ideasListWithPagination.list;
    const totalPages = ideasListWithPagination.totalPages;
    const limit = ideasListWithPagination.limit;
    res.render("admin/idea", {
      ideasList: ideas,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      search,
    });
  }

  static async usersView(req, res) {
    let search = req.query.search || "";
    let page = parseInt(req.query.page) || 1;

    const usersListWithPagination = await User.getListWithPagination(
      page,
      search,
    );
    const users = usersListWithPagination.list;

    const userListWithoutPassword = users.map((user) => {
      delete user.password;
      return user;
    });
    const usersList = userListWithoutPassword;
    const totalPages = usersListWithPagination.totalPages;
    const limit = usersListWithPagination.limit;

    res.render("admin/user", {
      usersList,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      search,
    });
  }
}

export default AdminController;
