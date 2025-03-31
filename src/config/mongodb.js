const { get } = require("../routes/static");

const dotenv = require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

let db;

const initDB = (callback) => {
    if (db) {
        console.warn("Db is already initialised!");
        return callback(null, db);
    }
    MongoClient.connect(process.env.MONGO_URL)
        .then((client) => {
            db = client.db();
            callback(null, db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDB = () => {
    if (!db) {
        throw Error("Db has not been initialised. Please call initDB first.");
    }
    return db;
};

module.exports = {
    initDB, getDB
};