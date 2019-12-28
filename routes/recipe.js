const Router = require('express-promise-router')
const db = require('../db')
    // create a new express-promise-router
    // this has the same API as the normal express router except
    // it allows you to use async functions as route handlers
const router = new Router()
    // export our router to be mounted by the parent application
module.exports = router

router.post('/', async(req, res) => {
    console.log("in recipe post");
    var json = req.body;
    var user = req.session.username;

    try {
        const { rows } = await db.query("INSERT INTO recipes (creator, recipe) VALUES ($1, $2)", [user, json]);
    } catch (error) {
        console.log("failed to create recipe");
        res.redirect('/Register.html');
    }

    res.redirect('/Editor.html');
})