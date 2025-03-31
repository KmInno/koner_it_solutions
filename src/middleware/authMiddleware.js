const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        req.flash("error", "Please login to view this page");
        return res.redirect("/auth/login");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            req.flash("error", "Session expired. Please login again");
            return res.redirect("/auth/login");
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;