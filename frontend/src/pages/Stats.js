import React, { useEffect, useState } from 'react';

function Stats() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetch('/api/stats', {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(setStats)
            .catch(err => {
                console.error('Failed to fetch stats:', err);
            });
    }, []);

    if (!stats) return <p>Loading stats...</p>;

    return (
        <div style={{ padding: 16 }}>
            <h2>Stats</h2>
            <p><strong>Total Items:</strong> {stats.total}</p>
            <p><strong>Average Price:</strong> ${stats.averagePrice.toFixed(2)}</p>
        </div>
    );
}

export default Stats;
