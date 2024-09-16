const { DataTypes, Op } = require('sequelize');
const conn = require('../db/conn');

const User = require('./User');
const BaseModel = require('./BaseModel');

//Idea
class Idea extends BaseModel {  
    
    /**
     * This method returns an object with a condition to be used in where clauses, based on the search string.
     * @param {string} search The search string to filter the results.
     * @returns {Object} An object with a condition to be used in where clauses.
     */
    static getSearchCondition(search){
        return {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { tags: { [Op.like]: `%${search}%` } }
            ]
        }
    };
}

Idea.init({ 
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        require: false,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: false,
        require: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: false,
        defaultValue: 0,
    }
}, {
    sequelize: conn,
    modelName: 'idea',
});

Idea.belongsTo(User)
User.hasMany(Idea)

//Descomentar se quiser atualizar a tabela
// Idea.sync({ alter: true })

module.exports = Idea