/**
 * @summary     VisualEvent_Loader
 * @description Loader for VisualEvent - injects the required CSS and Javascript into a page
 * @file        VisualEvent_Loader.js
 * @author      Allan Jardine (www.sprymedia.co.uk)
 * @license     GPL v2
 * @contact     www.sprymedia.co.uk/contact
 *
 * @copyright Copyright 2007-2013 Allan Jardine.
 *
 * This source file is free software, under the GPL v2 license:
 *   http://www.gnu.org/licenses/gpl-2.0.html
 */

(function(window, document){

	var script = document.getElementById('InjectJsLib');
	var LibObj = script.dataset.ijslib_obj;
	var LibDesc = script.dataset.ijslib_desc;
	var LibSrc = script.dataset.ijslib_src;

/*global VisualEvent,VisualEvent_Loader*/

if ( typeof VisualEvent_Loader == 'undefined' ) {

/**
 * VisualEvent_Loader is a class which will provide pre-loading of Javascript and CSS files
 * for VisualEvent based on the environment the script is running in (for example if jQuery is
 * already available or not).
 *
 *  @class VisualEvent_Loader
 *  @constructor
 *
 *  @example
 *     new VisualEvent_Loader();
*/
window.VisualEvent_Loader = function ()
{
	/* Sanity check */
	if ( ! this instanceof VisualEvent_Loader ) {
		alert( "VisualEvent loader warning: Must be initialised with the 'new' keyword." );
		return;
	}

	/**
	 * Settings object containing the settings information for the instance
	 *  @namespace
	 */
	this.s = {
		/**
		 * Flag to indicate if loading has finished or not. False until the required JS classes are
		 * found to be available.
		 *  @type     boolean
		 *  @default  false
		 */
		"loadingComplete": false
	};

	/**
	 * DOM elements used by the instance
	 *  @namespace
	 */
	this.dom = {
		/**
		 * Visual Label to show the end user that Visual Event is being loaded
		 *  @type element
		 *  @default  div
		 */
		"loading": document.createElement('div')
	};

	this._construct();
};

    /**
     * Load a new file into the DOM, and have it processed based on its type. This can be a
     * Javascript file, a CSS file or an image
     *  @param {string} file URL to the file to load
     *  @param {string} type The file type. Can be "css", "js" or "image"
     *  @returns {undefined}
     *  @private
     */
window.VisualEvent_Loader.loadFile = function ( file, type )
    {
        var n, img;

        if ( type == 'css' ) {
            n = document.createElement('link');
            n.type = 'text/css';
            n.rel = 'stylesheet';
            n.href = file;
            n.media = 'screen';
            document.getElementsByTagName('head')[0].appendChild( n );
        }
        else if ( type == 'image' ) {
            img = new Image( 1, 1 );
            img.src = file;
        }
        else {
            n = document.createElement( 'script' );
            n.setAttribute( 'language', 'JavaScript' );
            n.setAttribute( 'src', file );
            n.setAttribute( 'charset', 'utf8' );
            document.body.appendChild( n );
        }
    };

VisualEvent_Loader.prototype = {
	/**
	 * Constrctor - show a loading element to the end user and then load up the various files
	 * that are needed
	 *  @returns {undefined}
	 *  @private
	 */
	"_construct": function ()
	{
		var that = this,
			loading,
			style;

		/* Check to see if already loaded */
		if ( this.s.loadingComplete === true ) {
			return 0;
		}

		/* Show a label to the user to let them know that Visual Event is currently loading */
		loading = this.dom.loading;
		loading.setAttribute( 'id', 'InjectJsLib-Loading' );
		loading.appendChild( document.createTextNode( 'Loading ' + LibDesc + '...' ) );

		style = loading.style;
		style.position = 'fixed';
		style.bottom = '0';
		style.left = '0';
		style.color = 'white';
		style.padding = '5px 10px';
		style.fontSize = '11px';
		style.fontFamily = '"Lucida Grande", Verdana, Arial, Helvetica, sans-serif';
		style.zIndex = '55999';
		style.backgroundColor = '#93a8cf';
		document.body.insertBefore( loading, document.body.childNodes[0] );

		/* Start the polling for ready */
		if ( typeof window[LibObj] == 'object' ) {
			this._pollReady();
			return; // Don't need to load any files if lib already loaded
		}
		else {
			setTimeout( function () {
				that._pollReady();
			}, 1000 );
		}

		// load referenced library
        VisualEvent_Loader.loadFile(LibSrc, 'js');
	},

	/**
	 * Check if dependent library is initialized.
	 * It has to implement _isInitialized
	 *  @private
	 */
	"_pollReady": function ()
	{
		var that = this;

		if (window[LibObj].isLoaded()) {
			// Loading is complete, initialise Library
			this.s.loadingComplete = true;

			window[LibObj].toggle();

			/* Tidy up our display */
			document.body.removeChild( this.dom.loading );
		} else {
			setTimeout( function() {
				that._pollReady();
			}, 100 );
		}
	}
};
} /* /typeof VisualEvent_Loader */

    // Perform loading
var tmp = new VisualEvent_Loader();

})(window, document);
