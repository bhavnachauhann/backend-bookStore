// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const authentication = (req, res, next) => {
    // console.log("authentication",req.headers.authorization)
    const authHeader = req.headers["authorization"];
    // console.log("authHeader",authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log("token",token);
    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, "bookStore123", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token expired. Please SignIn again" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authentication };