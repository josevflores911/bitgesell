// tests/items.mock.test.js

jest.mock('fs/promises'); // mock fs before loading router

const fs = require('fs/promises');
const express = require('express');
const request = require('supertest');
const itemsRouter = require('../routes/items');

const mockItems = [
    { id: 1, name: 'Test Item', category: 'Test', price: 100 },
    { id: 2, name: 'Another Item', category: 'Sample', price: 200 },
];

describe('Items API with mocked fs', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();

        fs.readFile.mockResolvedValue(JSON.stringify(mockItems));
        fs.writeFile.mockResolvedValue();

        app = express();
        app.use(express.json());
        app.use('/api/items', itemsRouter);
        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({ error: err.message });
        });
    });

    it('GET /api/items should return limited items based on limit param', async () => {
        const res = await request(app).get('/api/items?limit=1');
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    it('GET /api/items/:id should return item by id from mock', async () => {
        const res = await request(app).get('/api/items/2');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockItems[1]);
    });

    // it('POST /api/items should create a new item and call writeFile', async () => {
    //     const newItem = { name: 'Bufanda', price: 30, category: 'Clothing' };
    //     const res = await request(app).post('/api/items').send(newItem);
    //     expect(res.status).toBe(201);
    //     expect(res.body.name).toBe('Bufanda');
    //     expect(fs.writeFile).toHaveBeenCalled();
    // });
});
