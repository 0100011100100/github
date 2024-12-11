const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Proxy middleware
app.use(
  '/proxy',
  createProxyMiddleware({
    target: 'https://example.com', // Placeholder target
    changeOrigin: true,
    selfHandleResponse: false,
    followRedirects: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      console.log(`Proxying request to: ${proxyReq.getHeader('host')}`);
    },
    onProxyRes: (proxyRes) => {
      delete proxyRes.headers['x-frame-options']; // Allow embedding
    },
    onError: (err, req, res) => {
      console.error('Proxy Error:', err.message);
      res.status(500).send('Proxy error occurred.');
    },
  })
);

// Serve the index.html for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});