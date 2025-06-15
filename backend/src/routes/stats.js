const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { mean } = require('../utils/stats'); 
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// GET /api/stats
router.get('/', (req, res, next) => {
  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    // Intentional heavy CPU calculation
    const stats = {
      total: items.length,
      averagePrice: mean(items.map(item => item.price))
    };

    res.json(stats);
  });
});

module.exports = router;