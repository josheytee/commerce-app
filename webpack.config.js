module.exports = {
  // Other Webpack configurations...

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your NestJS server
        secure: false,
        changeOrigin: true,
      },
      '/__webpack_hmr': {
        target: 'http://localhost:3000', // Proxy HMR requests to the backend
        secure: false,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying for HMR
      },
      '/_loading/sse': {
        target: 'http://localhost:3000', // Proxy SSE requests to the backend
        secure: false,
        changeOrigin: true,
      },
    },
    hot: true, // Enable Hot Module Replacement
  },
};
