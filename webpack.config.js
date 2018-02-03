const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const bundleOutputDir = './dist';

const libraryName = "poker-api-server";

function DtsBundlePlugin() {
}
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle');

        dts.bundle({
            name: libraryName,
            main: 'out/index.d.ts',
            out: '../dist/index.d.ts',
            removeSource: false,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 'poker-api-server': './src/index' },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        externals: {
            jquery: 'jquery'
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'dist/',
            library: {
                root: "PokerAPI",
                amd: 'poker-api-server',
                commonjs: 'poker-api-server',
            },
            libraryTarget: "umd",
            umdNamedDefine: true            
        },
        module: {
            rules: [
                { test: /\.(tsx|ts)?$/, include: /src/, use: 'awesome-typescript-loader?silent=true' }
            ]
        },
        plugins: [
            new CheckerPlugin(),
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new DtsBundlePlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new DtsBundlePlugin(),
                new webpack.optimize.UglifyJsPlugin()
            ])
    }];
};
