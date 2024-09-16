const { Model } = require('sequelize');
const conn = require('../db/conn');

const User = require('./User');
const Idea = require('./Idea');

class IdeaLike extends Model {
    static associate(models) {
        this.belongsTo(models.Idea);
        this.belongsTo(models.User);
    }

    /**
     * Marks each idea in the given list as being liked or not by the given user.
     * @param {Idea[]} ideas - The list of ideas to mark.
     * @param {number} userId - The ID of the user to check for a like.
     * @returns {Promise<Idea[]>} - The list of ideas with a new property, `liked`, indicating whether the user liked the idea or not.
     */
    static async markLikedByUser(ideas, userId) {
        const ideasWithLikes = await Promise.all(
          ideas.map(async (idea) => {
            const like = await IdeaLike.findOne({ where: { ideaId: idea.id, userId: userId } });
            if (like) {
              idea.liked = true;
            } else {
              idea.liked = false;
            }
            return idea;
          })
        );
        return ideasWithLikes;
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