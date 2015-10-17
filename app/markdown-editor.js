
var React = require( "react" );
var saveAs = require( "../js/FileSaver.min.js" );
var marked = require( "marked" );
marked.setOptions( {
	"renderer": new marked.Renderer(),
	"gfm": true,
	"tables": true,
	"breaks": false,
	"pedantic": false,
	"sanitize": true,
	"smartLists": true,
	"smartypants": false
} );

var ThemeManager = require( "material-ui/lib/styles/theme-manager" );
var darkRawTheme = require( "material-ui/lib/styles/raw-themes/light-raw-theme" );

var AppBar = require( "material-ui/lib/app-bar" );
var IconMenu = require( "material-ui/lib/menus/icon-menu" );
var MenuItem = require( "material-ui/lib/menus/menu-item" );
var IconButton = require( "material-ui/lib/icon-button" );
var Dialog = require( "material-ui/lib/dialog" );
var TextField = require( "material-ui/lib/text-field" );
var Snackbar = require( "material-ui/lib/snackbar" );

var MarkdownEditor = React.createClass( {
	"childContextTypes": {

        muiTheme: React.PropTypes.object

    },
    "getChildContext": function() {

        return {
            muiTheme: ThemeManager.getMuiTheme( darkRawTheme )
        };

    },
 	"getInitialState": function() {

    	return {
    		"value": "Type some *markdown* here!",
    		"outputName": "README.md"
    	};

  	},
  	"componentDidMount": function() {

  		var inputDom = this.refs.input.getDOMNode();
  		var inputHeaderDom = this.refs.inputHeader.getDOMNode();
  		var textAreaDom = this.refs.textarea.getDOMNode();

  		var resizeTextAreaInput = function() {

	  		var textAreaDomStyle = window.getComputedStyle( textAreaDom );

	  		textAreaDom.style.height = ( inputDom.offsetHeight -
	  			parseInt( textAreaDomStyle.paddingTop ) -
	  			parseInt( textAreaDomStyle.paddingBottom ) -
	  			inputHeaderDom.offsetHeight ) + "px";

	  	};

	  	resizeTextAreaInput();

	  	window.onresize = resizeTextAreaInput;

  	},
	"handleChange": function() {

    	this.setState( {
    		"value": this.refs.textarea.getDOMNode().value
    	} );

	},
	"rawMarkup": function() {

    	return {
    		"__html": marked( this.state.value )
    	};

	},
	"handleOutputNameChange": function() {

		this.setState( {
			"outputName": this.refs.outputName.getValue()
		} );

	},
	"onInputMenu": function( e, item ) {

		var props = item ? item.props : "";
		var itemName = props ? props.primaryText : "";
		var actions = {
			"Copy": this.copyInput,
			"Save": this.saveInput,
			"Clear": this.clearInput
		};
		var action = actions[ itemName ];

		action && action();

	},
	"copyInput": function() {

		var textAreaDom = this.refs.textarea.getDOMNode();
		
		textAreaDom.focus();
		textAreaDom.select();

		document.execCommand( "copy" );
	
		this.refs.copyNotice.show();

	},
	"saveInput": function() {

		// as file
		var content = JSON.stringify( this.state.value );
		var blob = new Blob(
			[ content ],
			{ "type": "text/plain;charset=utf-8" }
		);

		// Uses FileSaver.js
		// https://github.com/eligrey/FileSaver.js
		saveAs( blob, this.refs.outputName.getValue() );
	
	},
	"clearInput": function() {

		this.setState( {
			"value": ""
		} );
	
		this.refs.clearNotice.show();

	},
	"showTipsDialog": function() {

		this.refs.tipsDialog.show();

	},
	"render": function() {

		var menuButton = (
			<IconButton
				iconClassName="material-icons">
				more_vert
			</IconButton> );

		var dialogActions = [
			{ "text": "OK", "ref": "ok" }
		];
		var dialogContent = (
			<div className="dialogContent">
				Paragraphs: blank lines
				<br/>
				Headings: #
				<br/>
				Blockquotes: &gt;
				<br/>
				Italic: *
				<br/>
				Bold: **
				<br/>
				Unordered list: -
				<br/>
				Ordered list: 1.
				<br/>
				Nested list: 2 spaces
				<br/>
				Code: `
				<br/>
				Multiple code lines: ```
				<br/>
				links: [text](link)
			</div>
		);
		var tipsDialog = (
			<Dialog
    			ref="tipsDialog"
    			title="Markdown Syntax"
    			actions={dialogActions}
    			actionFocus="ok"
    			modal={true}>
    			{dialogContent}
    		</Dialog>
		);

    	return (
    		<div className="MarkdownEditor">
    			<div id="input" ref="input">
	        		<h3 className="header"
	        			ref="inputHeader">
	        			<AppBar
	        				title="Input"
	        				showMenuIconButton={false}
	        				iconElementRight={
	        					<IconMenu iconButtonElement={menuButton}
	        						width={100}
			        				openDirection="bottom-left"
			        				onItemTouchTap={this.onInputMenu} >
			        				<MenuItem primaryText="Copy" />
			        				<MenuItem primaryText="Save" />
			        				<MenuItem primaryText="Clear" />
			        			</IconMenu>
	        				} />
	        		</h3>
	        		<textarea
	        			className="inputContent"
	        			onChange={this.handleChange}
	        			ref="textarea"
	        			value={this.state.value}
	        			defaultValue={this.state.value} />
        		</div>
        		<div id="output" ref="output">
        			<h3 className="header"
        				ref="outputHeader">
        				<AppBar
        					title=""
        					iconElementLeft={
        						<TextField
        							ref="outputName"
        							hintText="Sample.md"
        							hintStyle={{color:'#fff'}}
        							value={this.state.outputName}
        							underlineStyle={{borderColor:'#00bcd4'}}
        							underlineFocusStyle={{borderColor:'#fff'}}
        							onChange={this.handleOutputNameChange} />
        					}
        					iconElementRight={
        						<IconButton
        							onClick={this.showTipsDialog}
        							iconClassName="material-icons">
        							info
        						</IconButton>
        					} />
        			</h3>
        			<div className="outputContent"
        				dangerouslySetInnerHTML={this.rawMarkup()} />
        		</div>
        		{tipsDialog}
        		<Snackbar
        			ref="copyNotice"
        			message="Copied content to clipboard"
        			autoHideDuration={3000} />
        		<Snackbar
        			ref="clearNotice"
        			message="Cleared content on input"
        			autoHideDuration={3000} />
      		</div>
    	);

	}

} );

module.exports = React.createFactory( MarkdownEditor );