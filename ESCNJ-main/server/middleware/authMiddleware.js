const authUtils = require("../utils/authUtils");

const authenticateRequest = (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Invalid or missing token!" });
        }

        const payload = authUtils.verifyAccessToken(token);
        if (!payload) {
            return res.status(401).json({ error: "Invalid or missing token!" });
        }

        req.user = payload;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Token verification failed!" });
    }
};

module.exports = {
    authenticateRequest
};
