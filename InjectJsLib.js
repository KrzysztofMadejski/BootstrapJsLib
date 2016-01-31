/**
 * @summary     InjectJsLib
 * @description Load external library (js&css) on page using bookmarklet. Based on VisualEvent2
 * @file        InjectJsLib.js
 * @author      Krzysiek Madejski (https://github.com/KrzysztofMadejski)
 * @author      Allan Jardine (www.sprymedia.co.uk)
 * @license     GPL v2
 * @contact     www.sprymedia.co.uk/contact
 *
 * @copyright Copyright 2007-2013 Allan Jardine.
 * @copyright Copyright 2014 Krzysiek Madejski.
 *
 * This source file is free software, under the GPL v2 license:
 *   http://www.gnu.org/licenses/gpl-2.0.html
 */

(function(window, document){

	var script = document.getElementById('InjectJsLib-Script');
	var LibObj = script.dataset.ijslib_obj;
	var LibDesc = script.dataset.ijslib_desc;
	var LibSrc = script.dataset.ijslib_src;

/*global InjectJsLib*/

if ( typeof InjectJsLib == 'undefined' ) {

/**
 * InjectJsLib is a class which will provide pre-loading of Javascript and CSS files
 * for external library.
 *
 *  @class InjectJsLib
 *  @constructor
 *
 *  @example
 *     new InjectJsLib();
*/
window.InjectJsLib = function ()
{
	/* Sanity check */
	if ( ! this instanceof InjectJsLib ) {
		// TODO check doesn't work. when it will work it should be simply return new InjectJsLib();
		alert( "InjectJsLib loader warning: Must be initialised with the 'new' keyword." );
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
		 * Visual Label to show the end user that library is being loaded
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
window.InjectJsLib.loadFile = function ( file, type )
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

InjectJsLib.prototype = {
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

		/* Show a label to the user to let them know that library is currently loading */
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
		this.begin_loading_timestamp = new Date().getTime();
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
        InjectJsLib.loadFile(LibSrc, 'js');
	},

	/**
	 * Check if dependent library is initialized.
	 * It has to implement isLoaded
	 *  @private
	 */
	"_pollReady": function ()
	{
		var that = this;

		if ((typeof window[LibObj] == 'object') && (typeof window[LibObj]['isLoaded'] != 'function')) {
			window.alert("Object " + LibObj + " doesn't have isLoaded function implemented.");

			document.body.removeChild( this.dom.loading );
			return;
		}

		if ((typeof window[LibObj] == 'object') && window[LibObj].isLoaded()) {
			// Loading is complete, initialise Library
			this.s.loadingComplete = true;

			window[LibObj].toggle();

			/* Tidy up our display */
			document.body.removeChild( this.dom.loading );
		} else {
			// alert for errors
			if (new Date().getTime() - this.begin_loading_timestamp > 1000 * 6) {
				alert(LibObj + " object is not defined in the referenced script or script was not loaded. Check developer console.");

				document.body.removeChild( this.dom.loading );
				return;
			} else {
				setTimeout(function () {
					that._pollReady();
				}, 100);
			}
		}
	}
};
} /* /typeof InjectJsLib */

    // Perform loading
var tmp = new InjectJsLib();

})(window, document);
