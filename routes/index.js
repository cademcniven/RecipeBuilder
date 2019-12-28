const users = require('./user')
const recipes = require('./recipe')
module.exports = app => {
    app.use('/users', users)
    app.use('/recipes', recipes)
}