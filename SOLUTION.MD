SOLUTION.md


Backend (Node.js)
Refactor Blocking I/O
The original implementation of the /api/items routes used synchronous file I/O (fs.readFileSync), which blocks the event loop and degrades performance under load. This was refactored to use asynchronous non-blocking operations (fs.promises.readFile and fs.promises.writeFile) to improve scalability and responsiveness.

Performance Optimization: Caching Stats
The /api/stats endpoint originally recalculated statistics on every request, leading to unnecessary CPU usage. To optimize this, we introduced a caching layer that stores computed stats and refreshes them automatically whenever the underlying items.json file changes, using fs.watch. This reduces redundant computation while ensuring up-to-date data.

Robust Testing
Unit and integration tests were added using Jest and Supertest, covering both happy paths and error scenarios for key API endpoints. Tests verify pagination, filtering, item retrieval, creation, and error handling with the real data file, ensuring code reliability and correctness.

Security
JWT-based authentication middleware was added to protect certain routes. Tokens are signed with a secret and validated on each request, ensuring only authorized access.

Frontend (React)
Fix Memory Leak on Fetch Aborts
The Items component was updated to use an AbortController that cancels ongoing fetch requests if the component unmounts or if a new fetch is triggered before the previous one completes. This prevents potential memory leaks and race conditions, keeping the UI consistent and performant.

Pagination and Server-Side Search
The frontend integrates with the backend’s paginated and searchable API by sending page and q (query) parameters. User input updates trigger data refetches, and the pagination controls allow users to navigate pages seamlessly.

Virtualized List Rendering
To handle potentially large lists efficiently, react-window was incorporated. This renders only the visible rows in the viewport, drastically improving rendering performance and reducing memory usage, especially on lower-end devices or with large datasets.

UI/UX Enhancements
Added skeleton loaders during data fetching to improve perceived responsiveness..


