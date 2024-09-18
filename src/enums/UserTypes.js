const UserTypes = {
    USER: 'user',
    ADMIN: 'admin',
    ROOT: 'root'
}
function getUserTypes() {
    return Object.values(UserTypes);
}

module.exports = { UserTypes, getUserTypes }