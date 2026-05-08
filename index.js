import express from 'express';
import cors from 'cors';
import fs from 'fs';
import Fuse from 'fuse.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load data
const elements = JSON.parse(fs.readFileSync('./data/elements.json', 'utf-8'));
const versionInfo = JSON.parse(fs.readFileSync('./data/version.json', 'utf-8'));

// Initialize Fuse.js for searching
const fuse = new Fuse(elements, {
  keys: ['name', 'category', 'author', 'tags'],
  threshold: 0.3
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Uiverse Galaxy API",
    version: versionInfo.version,
    last_updated: versionInfo.last_updated,
    endpoints: {
      all: "/api/elements",
      categories: "/api/categories",
      search: "/api/search?q=button",
      byCategory: "/api/category/:name",
      byId: "/api/element/:id",
      comprehensive: "/api/comprehensive",
      version: "/api/version"
    },
    total_elements: elements.length
  });
});

app.get('/api/version', (req, res) => {
  res.json(versionInfo);
});

app.get('/api/elements', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  res.json({
    total: elements.length,
    page,
    limit,
    data: elements.slice(startIndex, endIndex)
  });
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(elements.map(e => e.category))];
  res.json(categories);
});

app.get('/api/category/:name', (req, res) => {
  const categoryElements = elements.filter(e => e.category.toLowerCase() === req.params.name.toLowerCase());
  res.json(categoryElements);
});

app.get('/api/element/:id', (req, res) => {
  const element = elements.find(e => e.id === req.params.id);
  if (element) {
    res.json(element);
  } else {
    res.status(404).json({ error: "Element not found" });
  }
});

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });
  
  const results = fuse.search(query).map(r => r.item);
  res.json(results);
});

app.get('/api/comprehensive', (req, res) => {
  const comprehensive = elements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {});
  
  res.json({
    total_elements: elements.length,
    categories_count: Object.keys(comprehensive).length,
    data: comprehensive
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
