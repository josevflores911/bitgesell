import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Unauthorized or not found');

        const data = await response.json();

        if (isMounted) setItem(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (!item) return <p>Loading item...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;
