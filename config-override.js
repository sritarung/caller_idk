module.exports = function override(config, env) {
  const sourceMapLoader = config.module.rules.find(
    rule => rule.enforce === 'pre' && rule.use?.includes('source-map-loader')
  );

  if (sourceMapLoader) {
    sourceMapLoader.exclude = /face-api.js/;  // Exclude face-api.js from source-map-loader
  }

  return config;
};
