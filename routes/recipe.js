const Router = require('express-promise-router')
const db = require('../db')
    // create a new express-promise-router
    // this has the same API as the normal express router except
    // it allows you to use async functions as route handlers
const router = new Router()
    // export our router to be mounted by the parent application
module.exports = router

router.get('/search/:search/:tags', async(req, res) => {
    console.log("in search for recipes")
    var search = req.params.search;
    var tags = req.params.tags;

    //if both search fields were empty, return all recipes
    if (search == "00" && tags == "00") {
        const { rows } = await db.query("SELECT id, creator, recipe -> 'name' AS name FROM recipes");
        res.send(rows);
        return;
    }

    //if the search field isn't empty, query with constraints
    if (search != "00") {
        let list = [];
        list.push(search);

        if (tags != "00")
            list = list.concat(tags.split(","));

        let queryString = `SELECT id, creator, recipe -> 'name' AS name FROM recipes WHERE recipe ->> 'name' ILIKE '%' || '${list[0]}' || '%'`;

        for (let i = 1; i < list.length; i++) {
            queryString += ` AND (recipe->'tags')::jsonb ? '${list[i]}'`
        }

        queryString += ';';

        const { rows } = await db.query(queryString);
        res.send(rows);
        return;
    }

    //final case is when the search field is empty but the tags field is not
    let list = [];
    list.push(tags.split(","));

    let queryString = `SELECT id, creator, recipe -> 'name' AS name FROM recipes WHERE (recipe->'tags')::jsonb ? '${list[0]}'`;

    for (let i = 1; i < list.length; i++) {
        queryString += ` AND (recipe->'tags')::jsonb ? '${list[i]}'`
    }

    queryString += ';';

    const { rows } = await db.query(queryString);
    res.send(rows);
    return;
})

//get all recipes made by the logged in user
router.get('/cookbook', async(req, res) => {
    if (!req.session.username) {
        console.log("not signed in")
        return;
    }

    const { rows } = await db.query("SELECT id, creator, recipe -> 'name' AS name FROM recipes WHERE creator = $1", [req.session.username]);
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