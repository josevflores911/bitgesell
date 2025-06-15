### Login

<p align="center">
  <img src="https://github.com/user-attachments/assets/202f5cdf-fdd2-4770-974b-4c5495962b5b" alt="Login Screen" width="400" />
</p>

- The user and password can be anything, just fill the space.

### Items

<p align="center">
  <img src="https://github.com/user-attachments/assets/4472d629-1471-43a2-bb7f-a9ed5be1ebd5" alt="Items Screen" width="500" />
</p>

### Stats

<p align="center">
  <img src="https://github.com/user-attachments/assets/8835803e-c3c4-46fa-80b8-d27ea03fcdbd" alt="Stats Screen" width="500" />
</p>

### Skeleton

<p align="center">
  <img src="https://github.com/user-attachments/assets/b027fd36-a1d9-4a71-ac33-f6c946581036" alt="Skeleton Screen" width="500" />
</p>




# Take‑Home Assessment

Welcome, candidate! This project contains **intentional issues** that mimic real‑world scenarios.
Your task is to refactor, optimize, and fix these problems.

## Objectives

### 🔧 Backend (Node.js)

1. **Refactor blocking I/O**  
   - `src/routes/items.js` uses `fs.readFileSync`. Replace with non‑blocking async operations.

2. **Performance**  
   - `GET /api/stats` recalculates stats on every request. Cache results, watch file changes, or introduce a smarter strategy.

3. **Testing**  
   - Add **unit tests** (Jest) for items routes (happy path + error cases).

### 💻 Frontend (React)

1. **Memory Leak**  
   - `Items.js` leaks memory if the component unmounts before fetch completes. Fix it.

2. **Pagination & Search**  
   - Implement paginated list with server‑side search (`q` param). Contribute to both client and server.

3. **Performance**  
   - The list can grow large. Integrate **virtualization** (e.g., `react-window`) to keep UI smooth.

4. **UI/UX Polish**  
   - Feel free to enhance styling, accessibility, and add loading/skeleton states.

### 📦 What We Expect

- Idiomatic, clean code with comments where necessary.
- Solid error handling and edge‑case consideration.
- Tests that pass via `npm test` in both frontend and backend.
- A brief `SOLUTION.md` describing **your approach and trade‑offs**.

## Quick Start

node version: 18.XX
```bash
nvm install 18
nvm use 18

# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npm install
npm start
```

> The frontend proxies `/api` requests to `http://localhost:3001`.
