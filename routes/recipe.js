const Router = require('express-promise-router')
const db = require('../db')
    // create a new express-promise-router
    // this has the same API as the normal express router except
    // it allows you to use async functions as route handlers
const router = new Router()
    // export our router to be mounted by the parent application
module.exports = router

router.get('/:search', async(req, res) => {
    console.log("in recipe get");
    const { search } = req.params
    console.log(search);
    const { rows } = await db.query("SELECT id, creator, recipe -> 'name' AS name FROM recipes WHERE recipe ->> 'name' ILIKE '%' || $1 || '%';", [search]);
    res.send(rows)
})

router.get('/id/:search', async(req, res) => {
    console.log("in recipe get");
    const { search } = req.params
    console.log(search);
    const { rows } = await db.query("SELECT recipe FROM recipes WHERE id = $1", [search]);
    res.send(rows)
})

router.get('/', async(req, res) => {
    console.log("in recipe get");
    const { rows } = await db.query("SELECT id, creator, recipe -> 'name' AS name FROM recipes");
    res.send(rows)
})

router.post('/', async(req, res) => {
    console.log("in recipe post");
    const json = req.body;
    const user = req.session.username;

    try {
        db.query("INSERT INTO recipes (creator, recipe) VALUES ($1, $2) RETURNING id", [user, json]).then(response => {
            console.log(response.rows[0].id);
            res.send(response.rows[0].id);
            return;
        });
    } catch (error) {
        console.log("failed to create recipe");
        return;
    }
})