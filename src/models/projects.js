const mongodb = require('../config/mongodb');  

async function getPorjects() {
    try {
        const db = await mongodb.getDB();
        return db.collection('projects');
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error; 
    }
}

module.exports = {
    getPorjects
}

