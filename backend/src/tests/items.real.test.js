// tests/items.real.test.js

const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const request = require('supertest');
const itemsRouter = require('../routes/items');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

const mockItems = [
    { id: 1, name: 'Test Item', category: 'Test', price: 100 },
    { id: 2, name: 'Another Item', category: 'Sample', price: 200 },
];

describe('Items API with real file', () => {
    let app;

    beforeAll(async () => {
        // Overwrite file with test data
        await fs.writeFile(DATA_PATH, JSON.stringify(mockItems, null, 2));
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/items', itemsRouter);
        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({ error: err.message });
        });
    });

    it('GET /api/items should return list of items (happy path)', async () => {
        const res = await request(app).get('/api/items');
        expect(res.status).toBe(200);
        expect(res.body.items).toBeDefined();
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.totalItems).toBe(2);
    });

    it('GET /api/items/:id should return item by ID', async () => {
        const res = await request(app).get('/api/items/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Test Item');
    });

    it('GET /api/items/:id should return 404 if not found', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Item not found');
    });

    it('POST /api/items should create a new item and write to real file', async () => {
        const newItem = { name: 'New Item', category: 'New', price: 150 };
        const res = await request(app).post('/api/items').send(newItem);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('New Item');
    });
});
