const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack (config, env) {
    let htmlPlugin = null;

    const Plugins = config.plugins.filter((plugin) => {
      if(plugin instanceof HtmlWebpackPlugin) {
        htmlPlugin = plugin;
        return false;
      }
      return true;
    }) 

    const nextConfig = {
      ...config,
      entry: {
        main: path.resolve(__dirname, 'src/app/index.tsx'),
        background: path.resolve(__dirname, 'src/background/index.tsx'),
        content: path.resolve(__dirname, 'src/content/index.tsx')
      },
      output: {
        ...config.output,
        filename: `static/js/[name].js`,
        chunkFilename: `static/js/[name].js`,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '~background': path.resolve(__dirname, 'src/background'),
          '~content': path.resolve(__dirname, 'src/content'),
          '~app': path.resolve(__dirname, 'src/app'),
          '~common': path.resolve(__dirname, 'src/common'),
        },
      },
      plugins: [
        ...(htmlPlugin 
          ? [new HtmlWebpackPlugin({
            ...htmlPlugin.options,
            template: path.resolve(__dirname, 'public/index.html'),
            excludeChunks: ['background', 'content']
          })]
          : []),
        ...Plugins
      ]
    }
    return nextConfig
    
  }
}