const dotenv = require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

let dbMain; // For MONGO_URL
let dbUsers; // For MONGO_USERS_URL

// Initialize the main database
const initMainDB = (callback) => {
    if (dbMain) {
        console.warn("Main DB is already initialized!");
        return callback(null, dbMain);
    }
    MongoClient.connect(process.env.MONGO_URL)
        .then((client) => {
            dbMain = client.db();
            console.log("Main DB initialized successfully.");
            callback(null, dbMain);
        })
        .catch((err) => {
            callback(err);
        });
};

// Initialize the users database
const initUsersDB = (callback) => {
    if (dbUsers) {
        console.warn("Users DB is already initialized!");
        return callback(null, dbUsers);
    }
    MongoClient.connect(process.env.MONGO_USERS_URL)
        .then((client) => {
            dbUsers = client.db();
            console.log("Users DB initialized successfully.");
            callback(null, dbUsers);
        })
        .catch((err) => {
            callback(err);
        });
};

// Get the main database instance
const getMainDB = () => {
    if (!dbMain) {
        throw Error("Main DB has not been initialized. Please call initMainDB first.");
    }
    return dbMain;
};

// Get the users database instance
const getUsersDB = () => {
    if (!dbUsers) {
        throw Error("Users DB has not been initialized. Please call initUsersDB first.");
    }
    return dbUsers;
};

module.exports = {
    initMainDB,
    initUsersDB,
    getMainDB,
    getUsersDB
};