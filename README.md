# Uiverse Galaxy API (Organized)

This is a fully organized, public, and unlimited API for the [Uiverse.io Galaxy](https://github.com/uiverse-io/galaxy) project. It contains over 3,800 UI elements including buttons, cards, inputs, and more.

## Features
- **Organized Data**: All elements are parsed into a clean JSON format.
- **Searchable**: Built-in search functionality using Fuse.js.
- **Public & Unlimited**: Designed to be deployed on Vercel for global access.

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `GET /` | API Overview and status |
| `GET /api/elements` | Get all elements (paginated) |
| `GET /api/categories` | List all available categories |
| `GET /api/category/:name` | Get elements by category |
| `GET /api/element/:id` | Get a specific element by ID |
| `GET /api/search?q=query` | Search for elements |
| `GET /api/comprehensive` | Get all elements grouped by category |

## Deployment
To deploy this API to your own Vercel account:
1. Connect this repository to Vercel.
2. Vercel will automatically detect the `vercel.json` and deploy it as a Serverless Function.

## Data Source
All data is sourced from the [uiverse-io/galaxy](https://github.com/uiverse-io/galaxy) repository.
