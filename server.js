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
const MongoStore = require('connect-mongo');

/* ********************
Local host information
******************** */
const PORT = process.env.PORT || 10001; // Fallback to 10001 if PORT is not set
const HOST = process.env.HOST || '0.0.0.0'; // Fallback to '0.0.0.0' if HOST is not set

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session configuration
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET_2 || 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_USERS_URL, // Ensure it's the correct DB URL
            dbName: 'sessions', // Optional: Specify a database name for sessions
            collectionName: 'sessions', // Optional: Specify a collection name for sessions
        }),
        cookie: { secure: process.env.NODE_ENV === 'production' }, // Secure cookies in production
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

// Swagger API Documentation
app.use('/swagger', authenticateToken, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* *******************
Connecting the MongoDB databases
******************** */
mongodb.initDatabases((err, dbs) => {
    if (err) {
        console.log("Error initializing databases:", err);
        process.exit(1); // Exit the app if database connection fails
    } else {
        console.log("Databases initialized successfully:", Object.keys(dbs));

        // Start the server only after databases are initialized
        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
        });
    }
});
