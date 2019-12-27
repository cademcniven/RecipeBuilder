var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var cors = require('cors');
app.use(cors());

var mountRoutes = require('./routes');
mountRoutes(app);
app.listen(port);