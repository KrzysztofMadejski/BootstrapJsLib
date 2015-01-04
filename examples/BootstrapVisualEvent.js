// Step 1. load necessary js and css
InjectJsLib.loadFile("http://sprymedia.co.uk/VisualEvent/builds/VisualEvent-1398853496/css/VisualEvent.css", "css");
if (typeof jQuery == "undefined")
    InjectJsLib.loadFile("http://sprymedia.co.uk/VisualEvent/builds/VisualEvent-1398853496/js/VisualEvent-jQuery.js", "js");
else
    InjectJsLib.loadFile("http://sprymedia.co.uk/VisualEvent/builds/VisualEvent-1398853496/js/VisualEvent.js", "js");

// Step 2. Create lib definition, be sure to implement isLoaded and toggle methods
window.BootstrapVisualEvent = {
    "isLoaded": function(){
        return typeof VisualEvent == 'function' &&
            typeof VisualEventSyntaxHighlighter == 'object';
    },
    "toggle": function() {
        if (VisualEvent.instance !== null) {
            VisualEvent.close();
        } else {
            new VisualEvent();
        }
    }
};