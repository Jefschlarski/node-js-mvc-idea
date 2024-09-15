const { Model } = require('sequelize');
const conn = require('../db/conn');

const User = require('./User');
const Idea = require('./Idea');

class IdeaLike extends Model {
    static associate(models) {
        this.belongsTo(models.Idea);
        this.belongsTo(models.User);
    }
}

IdeaLike.init({}, {
    sequelize: conn,
    modelName: 'idea_like'
});

IdeaLike.belongsTo(Idea);
Idea.hasMany(IdeaLike);

IdeaLike.belongsTo(User);
User.hasMany(IdeaLike);

module.exports = IdeaLike;