const jwt = require('jsonwebtoken');

module.exports = function (req) {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
        return { user: null };
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { user: { id: decoded.userId } };
    } catch (err) {
        return { user: null };
    }
};
