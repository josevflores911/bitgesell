import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');

  // Recibe opcionalmente un signal para abortar la petición
  const fetchItems = useCallback(async (signal) => {
    const res = await fetch('http://localhost:3001/api/items?limit=500', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal, 
    });
    const json = await res.json();
    setItems(json);
  }, [token]); // token en dependencia porque puede cambiar

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
