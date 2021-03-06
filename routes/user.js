const Router = require('express-promise-router')
const db = require('../db')

const router = new Router()
module.exports = router

//this function handles account creation
router.post('/', async(req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    if (password == password2) {
        try {
            const { rows } = await db.query("INSERT INTO users (username, password) VALUES ($1,$2)", [username, password]);
            req.session.loggedin = true;
            req.session.username = username;
        } catch (error) {
            console.log("failed to create user");
            console.log(error);
            res.redirect('/Register.html');
            return;
        }

        res.redirect('/Editor.html');
    } else {
        res.redirect('/Register.html');
    }
})

router.get('/loggedin', function(req, res) {
    if (req.session.loggedin) {
        res.send({ username: req.session.username });
    } else
        res.status(400).send('Not Logged In');
});

router.get('/logout', function(req, res) {
    if (req.session.loggedin) {
        console.log("logging out");
        req.session.loggedin = false;
        res.status(200).send('Logged out');
    } else
        res.status(400).send('Not Logged In');
});

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