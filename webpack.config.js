module.exports = {
    entry: './build/src/main/js-reactify.js',

    externals: [{
        'js-spec': true,
        'js-surface': true 
    }],

    output: {
        path: __dirname + "/dist",
        filename: "js-reactify.js",
        libraryTarget: 'umd'
    }
};
