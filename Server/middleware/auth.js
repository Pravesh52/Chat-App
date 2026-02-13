const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.authorization;
   //  console.log("hello",token);
    if(!token) return res.status(401).json({ message: "Login first!" });

    try {
        const decoded = jwt.verify(token, "PRIVATESTRING");
        req.user = decoded;   // IMPORTANT: req.user yahi se aata hai
        // console.log("decoded",decoded);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;