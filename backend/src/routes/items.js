const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data asynchronously
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Utility to write data asynchronously
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { q = '', page = '1', limit = '10' } = req.query;

    // Filter by search (case insensitive)
    let filtered = data;
    if (q) {
      const qLower = q.toLowerCase();
      filtered = data.filter(item => item.name.toLowerCase().includes(qLower));
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedItems = filtered.slice(startIndex, endIndex);

    // Additional info (total, current page, total pages)
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const itemId = parseInt(req.params.id);
    const item = data.find(i => parseInt(i.id) === itemId);

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();

    item.id = Date.now(); // Generate unique ID
    data.push(item);

    await writeData(data);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
