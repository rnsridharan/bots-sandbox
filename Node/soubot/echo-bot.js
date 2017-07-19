
/*-----------------------------------------------------------------------------

Echo bot for basic validation of channels, connections, etc

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');

// default English ssml file
var ssml = require('./lib/ssml/locale/en/ssml');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
	function (session) {
		// basic echo
		//session.send("Echo bot enter.." + session.message.text);
		session.beginDialog('loopConversation');
	},
	function (session, results) {
	// optional function
	}
		
]);

bot.dialog('loopConversation', [
    function (session, args) {
    	if (!args)
    		{
    		//basic prompt    		
    		builder.Prompts.text(session, 'Hi, I am an echo bot. Please say something..I will echo it back', 
            		{speak: speak(session, 'Hi, I am an echo bot. Please say something..I will echo it back'),
            		inputHint: builder.InputHint.expectingInput
            		});
    		}
    		
    		else {
    			builder.Prompts.text(session, "You said.."+args,     		
            	{speak: speak(session, "You said.."+args),
        		inputHint: builder.InputHint.expectingInput
        		});
    		}
           	
    },
    function (session, results) {
       	session.dialogData.input = results.response ;
    	// Check for end of loop
       	var userinput = session.dialogData.input.toLowerCase();
        if (userinput == 'end' || userinput == 'bye') {
            // Return completed form
        	session.send("Bye..");
            session.endDialogWithResult({ response: session.dialogData.input });
        } else {
            // Next
            session.replaceDialog('loopConversation', session.dialogData.input);
        }
     }
]);

/*
//Add Q&A dialog
bot.dialog('q&aDialog', [
    function (session, args) {
        // Save previous state (create on first call)
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};

        // Prompt user for next field
        builder.Prompts.text(session, questions[session.dialogData.index].prompt);
    },
    function (session, results) {
        // Save users reply
        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;

        // Check for end of form
        if (session.dialogData.index >= questions.length) {
            // Return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // Next field
            session.replaceDialog('q&aDialog', session.dialogData);
        }
    }
]);
*/
/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}



