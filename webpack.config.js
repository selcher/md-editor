var webpack = require( "webpack" );
var path = require( "path" );
var nodeModulesPath = path.resolve( __dirname, "node_modules" );

var config = {
	
	"entry": {
		"app": [ "./app/main.js" ],
		"vendors": [ "react" ]
	},

	"resolve": {
		"moduleDirectories": [ "node_modules" ],
		"alias": {},
		"extensions": [ "", ".jsx", ".js" ]
	},

	"plugins": [
		new webpack.optimize.CommonsChunkPlugin(
			"vendors", "vendors.js"
		)
	],

	"output": {
		"path": "./build",
		"filename": "bundle.js"
	},

	"module": {

		"loaders": [
			{
				"text": /\.jsx$/,
				"loader": "jsx-loader?harmony"
			}
		]

	},

};

module.exports = config;