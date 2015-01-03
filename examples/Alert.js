window.Alert = {
    "isLoaded": function(){
        return true;
    },
    "toggle": function() {
        if (Alert.instance) {
            Alert.instance = false;
            console.log('Deactivating..');
        } else {
            Alert.instance = true;
            console.log('Activating!');
            alert('Alert!');
        }
    },
    "instance": false
};
