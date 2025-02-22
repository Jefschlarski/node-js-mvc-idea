import "dotenv/config";
import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";

const conn = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
);

try {
  await conn.authenticate();
  logger.info("Conexão com o banco de dados estabelecida com sucesso.");
} catch (error) {
  logger.error("Erro ao conectar com o banco de dados:", error);
}

export default conn;
