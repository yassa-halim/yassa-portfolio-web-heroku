const express = require('express');
const path = require('path');
const app = express();

// Serve static build files from Angular dist directory
app.use(express.static(path.join(__dirname, 'dist/portfolio/browser')));

// Send index.html for all SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/portfolio/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Angular Frontend Server running on port ${PORT}`);
});
