
/*-----------------------------------------------------------------------------

Data Collection bot for collecting basic data from the user

-----------------------------------------------------------------------------*/

var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');

var bot = new builder.UniversalBot(null, null, 'datacollectorbot');

//Export createLibrary() function
exports.createLibrary = function () {
return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('datacollectorbot:/');
}


bot.dialog('/',  [
	function (session) {
        builder.Prompts.text(session, "Hello... What's your name?",
        		{speak: "Hello... What's your name?",
    	    retrySpeak: "Hello... What's your name?",
    	    inputHint: builder.InputHint.expectingInput
    		});
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?",
        		{speak: "Hi " + results.response + ",How many years have you been coding?",
        	    retrySpeak: "Hi " + results.response + ",How many years have you been coding?",
        	    inputHint: builder.InputHint.expectingInput
        		});
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"],
        		{speak: 'What language do you code Node using?',
        	    	    retrySpeak: 'What language do you code Node using?',
        	    	    inputHint: builder.InputHint.expectingInput
        	    		});
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        var finalMessage = "Got it... " + session.userData.name + 
        " you've been programming for " + session.userData.coding + 
        " years and use " + session.userData.language + ".";
        
       session.say(finalMessage, finalMessage,
    		   {
    	   		inputHint: builder.InputHint.ignoringInput 
    		   });       
        // session.endDialogWithResult({ response: session.dialogData.input });
       session.send('Thanks.. Bye...');
       var msg = new builder.Message(session)
       .speak('Thanks.. Bye...')
       .inputHint(builder.InputHint.ignoringInput);
       session.send(msg).endDialog();

    }
]);


/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}



