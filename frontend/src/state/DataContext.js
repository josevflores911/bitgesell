import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  // Optionally receives a signal to abort the request
  const fetchItems = useCallback(async (signal) => {
    const res = await fetch('http://localhost:3001/api/items?limit=500', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal,
    });
    const json = await res.json();
    setItems(json.items);
  }, [token]); // token as dependency because it can change

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
