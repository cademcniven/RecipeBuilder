const Router = require('express-promise-router')
const db = require('../db')
    // create a new express-promise-router
    // this has the same API as the normal express router except
    // it allows you to use async functions as route handlers
const router = new Router()
    // export our router to be mounted by the parent application
module.exports = router
router.get('/:id', async(req, res) => {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
    res.send(rows[0])
})

router.post('/', async(req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    if (password == password2) {
        try {
            const { rows } = await db.query("INSERT INTO users (username, password) VALUES ($1,$2)", [username, password]);
            request.session.loggedin = true;
            request.session.username = username;
        } catch (error) {
            console.log("failed to create user");
            res.redirect('/Register.html');
        }

        res.redirect('/Editor.html');
    } else {
        res.redirect('/Register.html');
    }
})

router.post('/auth', async(request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        let rows;
        try {
            rows = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        } catch (error) {
            console.log(error.stack);
        }

        console.log(rows.rows[0]);
        if (typeof rows.rows[0] != 'undefined') {
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect('/Editor.html');
        } else {
            response.redirect('/Login.html');
        }

        response.end();
    }
});