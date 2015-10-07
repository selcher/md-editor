
var React = require( "react" );

var injectTapEventPlugin = require( "react-tap-event-plugin" );
injectTapEventPlugin();

var App = require( "./markdown-editor.js" );

React.render( App(), document.getElementById( "app" ) );