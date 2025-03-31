const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const env = require('dotenv').config();
const static = require('./src/routes/static');
const baseRoute = require('./src/routes/baseRoute');
const projectsRoute = require('./src/routes/projectsRoute');
const accountsRoute = require('./src/routes/accountRoute');
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const authenticateToken = require('./src/middleware/authMiddleware');
const methodOverride = require('method-override');
const mongodb = require('./src/config/mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const session = require('express-session');



/* ********************
local host information
******************** */
const PORT = process.env.PORT || 10001; // Fallback to 10001 if PORT is not set
const HOST = process.env.HOST || '0.0.0.0'; // Fallback to '0.0.0.0' if HOST is not set

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// middleware for parsing cookies
app.use(
    session({
        secret: 'env.parsed.ACCESS_TOKEN_SECRET', 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});
app.use(cookieParser());





app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Routes
app.use(static);
app.use('/', baseRoute);
app.use('/projects', projectsRoute);
app.use('/auth', accountsRoute);

// swagger
app.use('/swagger', authenticateToken, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* *******************
connecting the MongoDB server
******************** */
// mongodb.initUsersDB(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         app.listen(PORT, HOST, () => {
//             console.log(`Server running at http://${HOST}:${PORT}/`);
//         });
//     }
// });

const initMainDBPromise = new Promise((resolve, reject) => {
    mongodb.initMainDB((err) => {
        if (err) {
            reject("Error initializing Main DB: " + err);
        } else {
            resolve("Main DB initialized successfully");
        }
    });
});

const initUsersDBPromise = new Promise((resolve, reject) => {
    mongodb.initUsersDB((err) => {
        if (err) {
            reject("Error initializing Users DB: " + err);
        } else {
            resolve("Users DB initialized successfully");
        }
    });
});

Promise.all([initMainDBPromise, initUsersDBPromise])
    .then((messages) => {
        messages.forEach((msg) => console.log(msg));
        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
        });
    })
    .catch((error) => {
        console.log("Initialization error:", error);
    });

