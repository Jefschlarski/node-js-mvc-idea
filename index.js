const express =  require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const FileStore = require('session-file-store')(session); 
const path = require('path');
require ('./helpers/handlebarsHelpers');

const app = express();

const conn = require('./db/conn');

//models 

const Idea = require('./models/Idea');
const User = require('./models/User');
const IdeaLike = require('./models/IdeaLike');
const IdeaComment = require('./models/IdeaComment');

//Import routes
const ideaRoutes = require('./routes/IdeaRoutes');
const authRoutes = require('./routes/AuthRoutes');
const adminRoutes = require('./routes/AdminRoutes');


//import controllers
const IdeaController = require('./controllers/IdeaController');

app.use(express.json());

//template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//receber dados do req.body
app.use(
    express.urlencoded({
        extended: true
    })
)

// sessão
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path:  path.join(__dirname, 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date( Date.now() + 3600000 ),
            httpOnly: true
        }
    })
)

//flash
app.use(flash());

//public path
app.use(express.static('public'));

//set session to res
app.use(function(req, res, next) {
    if (req.session.userId) {
        res.locals.session = req.session;
    }
    next();
});

app.get('/', IdeaController.showIdeas)
app.use('/idea', ideaRoutes)
app.use('/', authRoutes)
app.use('/admin', adminRoutes)

conn
    .sync( { force: false } )
    // descomentar para recriar a tabela
    // .sync( { force: true } )
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));