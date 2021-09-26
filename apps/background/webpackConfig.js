module.exports = (config, context) => {
  return {
    ...config,
    optimization: {
      runtimeChunk: false,
    },
  };
};
