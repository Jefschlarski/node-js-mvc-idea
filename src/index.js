require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const flash = require('express-flash');

const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
require('./helpers/handlebarsHelpers');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const env = process.env.NODE_ENV || 'development';

let server;
if (env === 'production') {
    const privateKey = fs.readFileSync(path.join(__dirname, 'certificates/privkey.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, 'certificates/fullchain.pem'), 'utf8');
    const options = {
        key: privateKey,
        cert: certificate,
    };
    server = https.createServer(options, app);
    console.log('Rodando com HTTPS (produção)');
} else {
    server = http.createServer(app);
    console.log('Rodando com HTTP (desenvolvimento)');
}

app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

if (env === 'production') {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                upgradeInsecureRequests: []
            }
        }
    }));
} else {
    console.log('Segurança com Helmet ajustada para ambiente de desenvolvimento');
}

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,  
    password: process.env.REDIS_PASSWORD
});

redisClient.on('ready', () => {
    console.log('Redis está pronto e conectado.');
});

redisClient.on('error', (err) => {
    console.error('Erro ao conectar ao Redis:', err);
});

app.use(session({
    name: 'session',
    secret: process.env.SESSION_SECRET || 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        client: redisClient,
        logErrors: true
    }),
    cookie: {
        secure: env === 'production',
        maxAge: 3600000, 
        httpOnly: true 
    }
}));


app.use(flash());

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.session = req.session;
    }
    next();
});

const conn = require('./db/conn');
const Idea = require('./models/Idea');
const User = require('./models/User');
const IdeaLike = require('./models/IdeaLike');
const IdeaComment = require('./models/IdeaComment');

const ideaRoutes = require('./routes/IdeaRoutes');
const authRoutes = require('./routes/AuthRoutes');
const adminRoutes = require('./routes/AdminRoutes');

const IdeaController = require('./controllers/IdeaController');

app.get('/', IdeaController.showIdeas);
app.use('/idea', ideaRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});
conn.sync({ force: false })
    .then(() => {
        const port = env === 'production' ? 443 : 3000;
        server.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    })
    .catch(err => console.error(err));
