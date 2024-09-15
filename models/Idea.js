const { DataTypes, Model } = require('sequelize');
const conn = require('../db/conn');

const User = require('./User');

//Idea
class Idea extends Model {}

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
}, {
    sequelize: conn,
    modelName: 'idea',
});

Idea.belongsTo(User)
User.hasMany(Idea)

//Descomentar se quiser atualizar a tabela
// Idea.sync({ alter: true })

module.exports = Idea