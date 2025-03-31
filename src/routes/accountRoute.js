const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountsCont');

router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);
router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/logout', accountController.logout);

router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})


module.exports = router;