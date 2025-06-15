import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
  let isMounted = true;

  const loadItems = async () => {
    try {
      const token = localStorage.getItem('token'); // Trae el token actualizado
      await fetchItems(token);
    } catch (err) {
      if (isMounted) console.error(err);
    }
  };

  loadItems();

  return () => {
    isMounted = false;
  };
}, [fetchItems]);

  
  if (!items || !items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={`/api/items/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;
