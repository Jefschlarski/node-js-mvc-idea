const Idea = require('../models/Idea');
const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static async loginView(req, res) {
        res.render('auth/login')
    }

    static async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            req.flash('message', 'User not found, please try again!');
            res.render('auth/login', {email: email, password: password});
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            req.flash('message', 'Wrong password, please try again!');
            res.render('auth/login', {email: email, password: password});
            return
        }

        req.session.userId = user.id;
        req.session.userType = user.type;

        req.flash('message', 'Login successfully!');

        req.session.save(() => {
            res.redirect('/');
        })
    }

    static async registerView(req, res) {
        res.render('auth/register')
    }   

    static async register(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        if (password != confirmPassword) {
            req.flash('message', 'Passwords not match, please try again!');
            res.render('auth/register', {name: name, email: email, password: password, confirmPassword: confirmPassword});
            return
        }
        const userExists = await User.findOne({ where: { email: email } });
        if (userExists) {
            req.flash('message', 'Email already exists, please try again!');
            res.render('auth/register', {name: name, email: email, password: password, confirmPassword: confirmPassword});
            return
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        try {
            let user = await User.create({ name, email, password: hashedPassword });

            req.session.userId = user.id;
            req.session.userType = user.type;
            req.flash('message', 'User created successfully!');
            
            req.session.save(() => {
                res.redirect('/');
            })

        } catch (error) {
            console.log(error);
        }
    }

    static async logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    }
}