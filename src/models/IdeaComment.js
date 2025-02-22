import Sequelize from "sequelize";
const { DataTypes } = Sequelize;
import conn from "../db/conn.js";
import User from "./User.js";
import Idea from "./Idea.js";
import BaseModel from "./BaseModel.js";

class IdeaComment extends BaseModel {
  static async getCommentsByIdeaId(ideaId) {
    const comments = await this.findAll({
      where: { ideaId: ideaId },
      include: User,
      order: [["createdAt", "DESC"]],
    });
    return comments.map((comment) => comment.get({ plain: true }));
  }
}

IdeaComment.init(
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      require: true,
    },
  },
  {
    sequelize: conn,
    modelName: "ideaComment",
  },
);

IdeaComment.belongsTo(User);
User.hasMany(IdeaComment);

IdeaComment.belongsTo(Idea);
Idea.hasMany(IdeaComment);

//Descomentar se quiser atualizar a tabela
// IdeaComment.sync({ alter: true })

export default IdeaComment;
