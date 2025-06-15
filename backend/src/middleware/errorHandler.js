const jwt = require('jsonwebtoken');

// Secret key for signing tokens — store this safely (env variable preferred)
const SECRET_KEY = process.env.JWT_SECRET || 'UR_SECRET';

// Middleware to generate a token (like getCookie before)
const generateToken = (req, res) => {
  // Example: generate a token with a username or id from request body or query
  const { username } = req.body || { user: 'j', password: 'pass' };
  if (!username) {
    return res.status(400).json({ error: 'Username is required to generate token' });
  }

  const payload = { username };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // token expires in 1 hour

  res.json({ token });
};

// Middleware to verify token for protected routes
const verifyToken = (req, res, next) => {
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

  const token = authHeader.split(' ')[1]; // Expect 'Bearer TOKEN'

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    req.user = decoded; // attach decoded info to req.user
    next();
  });
};

// Not Found handler remains the same
const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
};

module.exports = { generateToken, verifyToken, notFound };
