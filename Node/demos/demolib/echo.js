
/*-----------------------------------------------------------------------------

Echo bot for basic validation of channels, connections,ssml features etc

-----------------------------------------------------------------------------*/
var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');



module.exports = [
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
];

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



