const path = require('path');
const HtmlWebpackPlugin = require('react-scripts/node_modules/html-webpack-plugin')


module.exports = {
  webpack (config, env) {
    let htmlPlugin = null;
    const Plugins = config.plugins.filter((plugin) => {
      if(plugin instanceof HtmlWebpackPlugin) {
        htmlPlugin = plugin;
        return false;
      }
      return true;
    });

    return {
      ...config,
      entry: {
        main: config.entry,
        background: path.resolve(__dirname, 'src/background.ts'),
        content: path.resolve(__dirname, 'src/content.tsx')
      },
      output: {
        ...config.output,
        filename: `static/js/[name].js`,
        chunkFilename: `static/js/[name].js`,
      },
      plugins: [
        ...(htmlPlugin 
          ? [new HtmlWebpackPlugin({
            ...htmlPlugin.options,
            excludeChunks: ['background', 'content']
          })]
          : []),
        ...Plugins
      ]
    }
  }
}