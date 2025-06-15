const express = require('express');
const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let cacheTimestamp = 0;

// Función para cargar y calcular stats
async function loadStats() {
  const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
  const items = JSON.parse(raw);

  const stats = {
    total: items.length,
    averagePrice: mean(items.map(item => item.price))
  };

  cachedStats = stats;
  cacheTimestamp = Date.now();
  return stats;
}

// Inicializar cache al arrancar
loadStats().catch(console.error);

// Vigilar cambios en el archivo para refrescar cache automáticamente
fs.watch(DATA_PATH, (eventType) => {
  if (eventType === 'change') {
    console.log('Items file changed, refreshing stats cache...');
    loadStats().catch(console.error);
  }
});

// Endpoint que devuelve stats cacheadas
router.get('/', (req, res, next) => {
  if (cachedStats) {
    return res.json(cachedStats);
  }
  // Por si acaso cache está vacía (primera llamada)
  loadStats()
    .then(stats => res.json(stats))
    .catch(next);
});

module.exports = router;
