
/*-----------------------------------------------------------------------------

Echo bot for basic validation of channels, connections,ssml features etc

-----------------------------------------------------------------------------*/


var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');


//For federation you don't need to provide a connector but you should
//ensure that each bot being federated over has a unique library name.
var bot = new builder.UniversalBot(null, null, 'signinbot');

//Export createLibrary() function
exports.createLibrary = function () {
 return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('signinbot:showSigninCard');
}

bot.dialog('showSigninCard', [
    function (session, args) {
    	var card = createSigninCard(session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.endDialog("Please complete authentication..");
    }

 ]);


/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}

// helper function to create signin card
function createSigninCard(session) {
    return new builder.SigninCard(session)
        .text('BotFramework Sign-in Card')
        .button('Sign-in', 'https://login.microsoftonline.com');
}


