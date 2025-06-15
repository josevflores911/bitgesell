require('dotenv').config(); // Load before anything else

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const logger = require('./middleware/logger');

const { generateToken, verifyToken, notFound } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 'UR_PORT';



app.use(cors({ origin: process.env.SITE_ROUTE }));
app.use(express.json());
app.use(morgan('dev'));
app.use(logger);
// Public route to generate token
app.post('/api/token', generateToken);


  // Example of protecting routes using verifyToken middleware
  app.use('/api/items', verifyToken, itemsRouter);
  app.use('/api/stats', verifyToken, statsRouter);

  // Not Found route handler
  app.use('*', notFound);

  // Error handler middleware (optional, for catching errors)
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  app.listen(port, () => console.log('Backend running on http://localhost:' + port));




