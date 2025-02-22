import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";
import helmet from "helmet";
import session from "express-session";
import Redis from "ioredis";
import { default as connectRedis } from "connect-redis";
import flash from "express-flash";
import compression from "compression";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import logger from "./utils/logger.js";
import { verifyToken, csrfProtection } from "./middleware/token.js";
import cookieParser from "cookie-parser";

import "./helpers/handlebarsHelpers.js";
import conn from "./db/conn.js";
import ideaRoutes from "./routes/IdeaRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import IdeaController from "./controllers/IdeaController.js";
import { authMiddleware } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const env = process.env.NODE_ENV || "development";

let server;
if (env === "production") {
  const privateKey = fs.readFileSync(
    path.join(__dirname, "certificates/privkey.pem"),
    "utf8",
  );
  const certificate = fs.readFileSync(
    path.join(__dirname, "certificates/fullchain.pem"),
    "utf8",
  );
  const options = {
    key: privateKey,
    cert: certificate,
  };
  server = https.createServer(options, app);
  console.log("Rodando com HTTPS (produção)");
} else {
  server = http.createServer(app);
  console.log("Rodando com HTTP (desenvolvimento)");
}

app.use(
  "/icons",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font")),
);

if (env === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Resource-Policy": "same-origin",
        },
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      noSniff: true,
      xssFilter: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );
} else {
  console.log("Segurança com Helmet ajustada para ambiente de desenvolvimento");
}

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("ready", () => {
  logger.info("Redis está pronto e conectado.");
});

redisClient.on("error", (err) => {
  logger.error("Erro ao conectar ao Redis:", err);
});

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new connectRedis({
      client: redisClient,
      logErrors: true,
    }),
    cookie: {
      secure: env === "production",
      maxAge: 3600000,
      httpOnly: true,
    },
  }),
);

app.use(flash());
app.use(verifyToken);
app.use(csrfProtection);
app.use(authMiddleware);

app.get("/", IdeaController.showIdeas);

app.use("/idea", ideaRoutes);
app.use("/", authRoutes);
app.use("/", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
});
app.use(limiter);

// Adicionar compressão
app.use(compression());

// Configurar cache para arquivos estáticos
const oneDay = 86400000;
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: oneDay,
    etag: true,
  }),
);

conn
  .sync({ force: false })
  .then(() => {
    const port = env === "production" ? 443 : 3000;
    server.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => console.error(err));
