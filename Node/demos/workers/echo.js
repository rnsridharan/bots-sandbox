
/*-----------------------------------------------------------------------------

Echo bot for basic validation of channels, connections,ssml features etc

-----------------------------------------------------------------------------*/


var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');
// include DemoHelpers functions
var demohelpers = require('./../utils/DemoHelpers');


//For federation you don't need to provide a connector but you should
//ensure that each bot being federated over has a unique library name.
var bot = new builder.UniversalBot(null, null, 'echobot');

//Export createLibrary() function
exports.createLibrary = function () {
 return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('echobot:loopConversation');
}

bot.dialog('loopConversation', [
    function (session, args) {
    	if (!args)
    		{
    		//basic prompt    		
    		builder.Prompts.text(session, 'Hi, I am an echo bot. Please say something..I will echo it back until you say Bye or End', 
            		{speak: demohelpers.speak(session, 'Hi, I am an echo bot. Please say something..I will echo it back until you say Bye or End'),
            		inputHint: builder.InputHint.expectingInput
            		});
    		}
    		
    		else {
    			/*
    			var richresponse = {
    				    title: 'G Boom Baa',
    				    subtitle: 'Echo Bot demo',
    				    contentType: 'image/jpg',
    				    filePath: './images/somnath.jpg',
    				    attachmentFileName: 'somnath.jpg',
    				    answer: "You said.."+ args,
    				    contentUrl: 'http://www.google.com'   				    
    				};
    			
    			demohelpers.sendRichResponse(session, richresponse);
    			*/
    			
    			builder.Prompts.text(session, "You said.."+args,     		
            	{speak: demohelpers.speak(session, "You said.."+args),
        		inputHint: builder.InputHint.acceptingInput
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





