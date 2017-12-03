const webpack = require('webpack'),
    path = require('path'),
    fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const distPath = path.join(__dirname + '/dist');
const srcPath = path.join(__dirname + '/src');

const htmlFiles = fs.readdirSync(srcPath).filter(fileName => path.extname(fileName) === '.html');

const plugins = [];

htmlFiles.forEach(fileName => {
    plugins.push(new HtmlWebpackPlugin({
        filename: fileName,
        template: path.join(srcPath, fileName)
    }));
});

const cssFileName = process.env.NODE_ENV === 'production' ? 'style/[name].css' : 'style/[name].[contenthash].css';

const extractSass = new ExtractTextPlugin(cssFileName);
plugins.push(extractSass);
plugins.push(new webpack.DefinePlugin({
    app: {
        environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
    }
}));

const config = {
    entry: path.join(srcPath, '/index.js'),
    output: {
        path: distPath,
        publicPath: '',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                use: extractSass.extract(['css-loader', 'resolve-url-loader', 'sass-loader']),
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    { loader: 'url-loader', options: { name: 'font/[name].[ext]', limit: 0 } },
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    'url-loader?limit=10000&name=assets/imgs/[name].[ext]',
                    // 'file-loader?name=/assets/[name].[ext]',
                    /*'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'*/
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.html', '.css', 'scss']
    },
    devServer: {
        contentBase: path.join(__dirname, "src")
    },
    plugins: plugins
};
config.devtool = '#cheap-module-source-map';
console.log('curreunt mode : ', process.env.NODE_ENV + ' mode');

module.exports = config;