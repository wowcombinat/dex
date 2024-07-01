const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "zlib": require.resolve("browserify-zlib"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "assert": require.resolve("assert"),
    "path": require.resolve("path-browserify")
  };
  
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
