var Codebird = require("codebird");
var cb = new Codebird();
cb.setConsumerKey('CONSUMER_KEY', 'CONSUMER_SECRET_KEY');

var bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);

if(bearerToken == null){
	cb.__call(
	    'oauth2_token',
	    {},
	    function (reply) {
	        var bearer_token = reply.access_token;
	        cb.setBearerToken(bearer_token);
	        Ti.App.Properties.setString('TwitterBearerToken', bearer_token);
	        fetchTwitter();
	    }
	);
} else {
	Ti.API.info("We do have a bearer token...");
	cb.setBearerToken(bearerToken);
	fetchTwitter();
}

function fetchTwitter() {
	cb.__call(
	    'search_tweets',
	    "q="+Ti.Network.encodeURIComponent("#CPRecife2"),
	    function (reply) {
	    	Alloy.Collections.twitters.reset(reply.statuses);
	    },
	    true // this parameter required
	);	
};

function transformFunction(model) {
    // Need to convert the model to a JSON object
    var transform = model.toJSON();
    transform.fromUser = transform.user.screen_name;
    transform.profile_image_url = transform.user.profile_image_url;
    return transform;
}			

if (OS_ANDROID) {
	$.win.addEventListener('open', function(e){
		var actionBar = $.win.activity.actionBar;
		actionBar.title = "#CPRecife2";
		$.win.activity.invalidateOptionsMenu();
	});
}
