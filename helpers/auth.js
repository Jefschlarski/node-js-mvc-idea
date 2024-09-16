const bcrypt = require('bcryptjs');

module.exports.checkAuth = (req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/login');
    }

    next();
}

module.exports.checkPermission = (req, res, next) => {
    const userType = req.session.userType;
    if (userType != 'admin' && userType != 'root') {
        return res.redirect('/idea');
    }

    next();
}

module.exports.hashPassword = (password, salt) => {
    if (!salt) {
        salt = bcrypt.genSaltSync(10);
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

module.exports.checkPassword = (password, hashedPassword) => {
    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
    return passwordMatch;
}