import { Op } from "sequelize";
import conn from "../db/conn.js";
import { UserTypes, getUserTypes } from "../enums/UserTypes.js";
import BaseModel from "./BaseModel.js";
import { DataTypes } from "sequelize";

//User
class User extends BaseModel {
  static getSearchCondition(search) {
    return {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ],
    };
  }
}

User.init(
  {
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
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    csrfToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    csrfTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: conn,
    modelName: "user",
  },
);

//Descomentar se quiser atualizar a tabela
// User.sync({ alter: true })

export default User;
