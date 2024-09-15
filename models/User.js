const { DataTypes, Model } = require('sequelize');
const conn = require('../db/conn');
const { UserTypes, getUserTypes } = require('../enums/UserTypes');

//User
class User extends Model {}

User.init({
    name: {
        type: DataTypes.STRING,
        require: true,
    },
    email: {
        type: DataTypes.STRING,
        require: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        require: true,
    },
    type: {
        type: DataTypes.ENUM(...getUserTypes()),
        defaultValue: UserTypes.USER,
    }
}, {
    sequelize: conn,
    modelName: 'user',
});

//Descomentar se quiser atualizar a tabela
// User.sync({ alter: true })

module.exports = User