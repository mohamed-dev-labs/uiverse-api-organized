import fs from 'fs';
import path from 'path';

const GALAXY_PATH = '/home/ubuntu/galaxy';
const OUTPUT_PATH = '/home/ubuntu/uiverse-api/data/elements.json';

const categories = [
  'Buttons', 'Cards', 'Checkboxes', 'Forms', 'Inputs', 
  'loaders', 'Notifications', 'Patterns', 'Radio-buttons', 
  'Toggle-switches', 'Tooltips'
];

function parseFile(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // Extract metadata from comments if available
  // Example: /* From Uiverse.io by 0x-Sarthak  - Tags: button, hover, rounded, animated, hover button */
  const metaMatch = content.match(/\/\* From Uiverse\.io by (.*?) - Tags: (.*?) \*\//);
  const author = metaMatch ? metaMatch[1].trim() : 'Unknown';
  const tags = metaMatch ? metaMatch[2].split(',').map(t => t.trim()) : [];

  // Split HTML and CSS
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  const html = content.replace(/<style>[\s\S]*?<\/style>/, '').trim();
  const css = styleMatch ? styleMatch[1].trim() : '';

  return {
    id: fileName.replace('.html', ''),
    name: fileName.replace('.html', '').split('_').pop().replace(/-/g, ' '),
    category,
    author,
    tags,
    html,
    css,
    full_content: content
  };
}

const allElements = [];

categories.forEach(category => {
  const categoryPath = path.join(GALAXY_PATH, category);
  if (fs.existsSync(categoryPath)) {
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.html'));
    files.forEach(file => {
      try {
        const element = parseFile(path.join(categoryPath, file), category);
        allElements.push(element);
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
      }
    });
  }
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allElements, null, 2));
console.log(`Successfully parsed ${allElements.length} elements.`);
