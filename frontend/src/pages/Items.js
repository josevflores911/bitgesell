import React, { useEffect, useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';
import '../styles/items.css';

function Items() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);

  // Fetch items from the API with optional search query and pagination
  const fetchItems = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Ensure the token is updated
      const params = new URLSearchParams({ q, page });
      const res = await fetch(`/api/items?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Fetch items when search query or page changes
  useEffect(() => {
    fetchItems();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [q, page]);

  // Update search query and reset page to 1
  const handleSearchChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  // Skeleton loader row for loading state
  const SkeletonRow = ({ style }) => (
    <div className="skeleton-row" style={style} aria-hidden="true" />
  );

  // Single row rendering for each item
  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div className="item-row" style={style} key={item.id}>
        <Link to={`/api/items/${item.id}`} tabIndex={0}>
          {item.name}
        </Link>
      </div>
    );
  };

  return (
    <section aria-label="Items list" className="items-container">
      <label htmlFor="search-input" className="items-label">
        Search items:
      </label>
      <input
        id="search-input"
        type="search"
        value={q}
        onChange={handleSearchChange}
        placeholder="Search items..."
        className="items-search-input"
        aria-describedby="search-desc"
      />
      <div id="search-desc" style={{ display: 'none' }}>
        Enter text to search items. The list will update automatically.
      </div>

      {loading ? (
        <List
          height={350}
          itemCount={10}
          itemSize={40}
          width="100%"
          className="items-list"
        >
          {SkeletonRow}
        </List>
      ) : items.length > 0 ? (
        <List
          height={350}
          itemCount={items.length}
          itemSize={40}
          width="100%"
          className="items-list"
          role="list"
          aria-live="polite"
        >
          {Row}
        </List>
      ) : (
        <p role="alert" className="no-results">
          No results found.
        </p>
      )}

      <nav aria-label="Pagination" className="pagination-container">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page <= 1 || loading}
          aria-disabled={page <= 1 || loading}
          className="pagination-button"
        >
          Previous
        </button>
        <span aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || loading}
          aria-disabled={page >= totalPages || loading}
          className="pagination-button"
        >
          Next
        </button>
      </nav>
    </section>
  );
}

export default Items;
