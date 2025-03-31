const mongodb = require('../config/mongodb');  

async function getPorjects() {
    try {
        const db = await mongodb.getMainDB();
        return db.collection('projects');
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error; 
    }
}
async function getUsers() {
    try {
        const db = await mongodb.getUsersDB();
        return db.collection('users');
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

module.exports = {
    getPorjects,
    getUsers
}

