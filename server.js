const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const env = require('dotenv').config();
const static = require('./src/routes/static');
const baseRoute = require('./src/routes/baseRoute');
const projectsRoute = require('./src/routes/projectsRoute');
const methodOverride = require('method-override');
const mongodb = require('./src/config/mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');


/* ********************
local host information
******************** */
const PORT = process.env.PORT || 10001; // Fallback to 10001 if PORT is not set
const HOST = process.env.HOST || '0.0.0.0'; // Fallback to '0.0.0.0' if HOST is not set

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));




app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Routes
app.use(static);
app.use('/', baseRoute);
app.use('/projects', projectsRoute);

// swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/* *******************
connecting the MongoDB server
******************** */
mongodb.initDB(function (err) {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
        });
    }
});
