const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

    entry: {
        'index': './src/assets/js/index.js'
    },

    output: {
        'path': path.resolve(__dirname, 'dist'),
        'filename': 'script.js',

    },

    module: {rules:[
        {
            test: /\.(css|s[ac]ss)$/i,
            use: ['style-loader', 'css-loader', 'sass-loader']
        },

        {
            test : /\.js$/i,
            exclude : /node_modules/,
            use : {
                loader : 'babel-loader',
                options : {
                    presets : ['@babel/preset-env']
                }
            }
        },

        {
            test: /\.(jpe?g|png|webp)/i,
            type: 'asset/resource'
        }
    ]},
    
    plugins: [
        new htmlWebpackPlugin({
            title: 'Best city to live',
            minimize: false,
            template: './src/index.html'
        })
    ],

    devServer: {
        port: 8000,
        open: {
            app: {
                name: 'Google Chrome'
            }
        },
        static : path.resolve(__dirname, 'dist')
    },

    optimization: {
        minimize: false
    },

    mode : 'production'
}