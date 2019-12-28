var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
app.use(cors());
app.use(session({
    secret: 'dfadskajfhsdklfjhsa543425345gdsfd',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mountRoutes = require('./routes');
mountRoutes(app);

app.use(express.static('html'));
app.use(express.static('css'));
app.use(express.static('js'));

app.listen(port);