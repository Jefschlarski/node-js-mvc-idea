const { DataTypes, Model } = require('sequelize');
const conn = require('../db/conn');

const User = require('./User');
const Idea = require('./Idea');

class IdeaComment extends Model {
    static associate(models) {
        this.belongsTo(models.Idea);
        this.belongsTo(models.User);
    }
}

IdeaComment.init({
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        require: false,
    },
}, {
    sequelize: conn,
    modelName: 'idea_comment',
    primaryKey: false,
});

IdeaComment.belongsTo(Idea);
Idea.hasMany(IdeaComment);

IdeaComment.belongsTo(User);
User.hasMany(IdeaComment);

module.exports = IdeaComment;