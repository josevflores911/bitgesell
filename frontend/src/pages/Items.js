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

  const fetchItems = async () => {
  if (abortControllerRef.current) abortControllerRef.current.abort();

  const controller = new AbortController();
  abortControllerRef.current = controller;

  setLoading(true);
  try {
    const token = localStorage.getItem('token'); //  Aseguramos el token actualizado
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

  useEffect(() => {
    fetchItems();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [q, page]);

  const handleSearchChange = (e) => {
    setQ(e.target.value);
    setPage(1);
  };

  // Skeleton loader para filas
  const SkeletonRow = ({ style }) => (
    <div
      style={{
        ...style,
        backgroundColor: '#eee',
        borderRadius: '4px',
        margin: '5px 10px',
        height: '30px',
        animation: 'pulse 1.5s infinite',
      }}
      aria-hidden="true"
    />
  );

  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <div
        style={{
          ...style,
          padding: '5px 10px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link to={`/api/items/${item.id}`} tabIndex={0}>
          {item.name}
        </Link>
      </div>
    );
  };

  return (
    <section aria-label="Lista de items" className="items-container">
      <label htmlFor="search-input" className="items-label">
        Buscar items:
      </label>
      <input
        id="search-input"
        type="search"
        value={q}
        onChange={handleSearchChange}
        placeholder="Buscar items..."
        className="items-search-input"
        aria-describedby="search-desc"
      />
      <div id="search-desc" style={{ display: 'none' }}>
        Introduzca texto para buscar items. La lista se actualizará automáticamente.
      </div>

      {loading ? (
        <List
          height={350}
          itemCount={10}
          itemSize={40}
          width="100%"
          className="items-list"
        >
          {({ style }) => <div className="skeleton-row" style={style} aria-hidden="true" />}
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
          {({ index, style }) => (
            <div style={style} className="item-row" key={items[index].id}>
              <Link to={`/api/items/${items[index].id}`} tabIndex={0}>
                {items[index].name}
              </Link>
            </div>
          )}
        </List>
      ) : (
        <p role="alert" className="no-results">
          No hay resultados.
        </p>
      )}

      <nav aria-label="Paginación" className="pagination-container">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page <= 1 || loading}
          aria-disabled={page <= 1 || loading}
          className="pagination-button"
        >
          Anterior
        </button>
        <span aria-live="polite">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || loading}
          aria-disabled={page >= totalPages || loading}
          className="pagination-button"
        >
          Siguiente
        </button>
      </nav>


    </section>
  );
}

export default Items;
