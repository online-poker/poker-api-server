const path = require('path');
const webpack = require('webpack');
const bundleOutputDir = './dist';
const DeclarationBundlerPlugin = require('types-webpack-bundler');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const libraryName = "poker-api-server";

function DtsBundlePlugin() {
}
DtsBundlePlugin.prototype.apply = function (compiler) {
    // compiler.plugin('done', function () {
    //     var dts = require('dts-bundle');

    //     dts.bundle({
    //         name: libraryName,
    //         main: 'out/index.d.ts',
    //         out: '../dist/index.d.ts',
    //         removeSource: false,
    //         outputAsModuleFolder: true // to use npm in-package typings
    //     });
    // });
    const { webpack } = compiler

    const { Compilation } = webpack

    const { RawSource } = webpack.sources
    compiler.hooks.thisCompilation.tap('DeclarationBundlerPlugin', (compilation) => {
        compilation.hooks.processAssets.tap({
            name: 'DeclarationBundlerPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        }, (assets) => {
            //collect all generated declaration files
            //and remove them from the assets that will be emitted
            const declarationFiles = {}
            for (const filename in assets) {
                if (filename.indexOf('.d.ts') !== -1) {
                    declarationFiles[filename] = assets[filename]
                    compilation.deleteAsset(filename)
                }
            }
            //combine them into one declaration file
            //const combinedDeclaration = this.generateCombinedDeclaration(declarationFiles)

            //and insert that back into the assets
            //compilation.emitAsset(this.out, new RawSource(combinedDeclaration))
            var dts = require('dts-bundle');

            dts.bundle({
                name: libraryName,
                main: 'out/index.d.ts',
                out: '../dist/index.d.ts',
                removeSource: false,
                outputAsModuleFolder: true // to use npm in-package typings
            });
        })
    });
};

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        //mode: isDevBuild ? "development" : "production",
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
                { test: /\.(tsx|ts)?$/, include: /src/, use: 'ts-loader' }
            ]
        },
        plugins: [
            //new ForkTsCheckerWebpackPlugin(),
            new DtsBundlePlugin(),
            // new DeclarationBundlerPlugin({
            //     moduleName: libraryName,
            //     out:'./index.d.ts',
            // }),
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
            ])
    }];
};
