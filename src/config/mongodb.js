const dotenv = require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

let dbUsers = null;
let dbProjects = null;

// Initialize the users database
const initUsersDB = (callback) => {
    if (dbUsers) {
        console.warn("Users DB is already initialized!");
        return callback(null, dbUsers);
    }
    MongoClient.connect(process.env.MONGO_USERS_URL)
        .then((client) => {
            dbUsers = client.db("usersdb"); // Explicitly select the usersdb
            console.log("Users DB initialized successfully.");
            callback(null, dbUsers);
        })
        .catch((err) => {
            callback(err);
        });
};


// Initialize the projects database
const initProjectsDB = (callback) => {
    if (dbProjects) {
        console.warn("Projects DB is already initialized!");
        return callback(null, dbProjects);
    }
    MongoClient.connect(process.env.MONGO_PROJECTS_URL)
        .then((client) => {
            dbProjects = client.db("projectsdb"); // Explicitly select the projectsdb
            console.log("Projects DB initialized successfully.");
            callback(null, dbProjects);
        })
        .catch((err) => {
            callback(err);
        });
};


// Initialize both databases
const initDatabases = (callback) => {
    initUsersDB((errUsers, usersDB) => {
        if (errUsers) return callback(errUsers);

        initProjectsDB((errProjects, projectsDB) => {
            if (errProjects) return callback(errProjects);

            console.log("Both databases initialized successfully.");
            callback(null, { usersDB, projectsDB });
        });
    });
};

// Get the users database instance
const getUsersDB = () => {
    if (!dbUsers) {
        throw Error("Users DB has not been initialized. Please call initUsersDB first.");
    }
    return dbUsers;
};

// Get the projects database instance
const getProjectsDB = () => {
    if (!dbProjects) {
        throw Error("Projects DB has not been initialized. Please call initProjectsDB first.");
    }
    return dbProjects;
};

module.exports = {
    initUsersDB,
    initProjectsDB,
    initDatabases,
    getUsersDB,
    getProjectsDB,
};
