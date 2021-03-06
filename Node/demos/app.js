
/*-----------------------------------------------------------------------------

Routing Demo Bot that routes to various demos

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');


// include worker bots 
var signinbot = require('./workers/signin');
var echobot = require('./workers/echo');
var polyglotbot = require('./workers/polyglot');
var datacollectorbot = require('./workers/datacollector');
var qnabot = require('./workers/qna');
var knowledgebot = require('./workers/knowledge');
//include DemoHelpers functions
var demohelpers = require('./utils/DemoHelpers');

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


var DemoLabels = {
	    Signin: 'Sign In Bot Demo',
	    Echo: 'Echo Bot demo',
	    Polyglot: 'Multi Lingual demo',
	    Datacollector: 'Data Collector demo',
	    QnA: 'Q & A demo',
	    Knowledge: 'Knowledge demo',
	    Support: 'Help'
	};

var demochoices1 = [DemoLabels.Echo,  DemoLabels.Polyglot, DemoLabels.Datacollector,
	 DemoLabels.QnA, DemoLabels.Knowledge];

var demochoices2 = [DemoLabels.Echo,  DemoLabels.Polyglot, DemoLabels.Datacollector,
	 DemoLabels.Knowledge];






var demoselection = "";

var bot = new builder.UniversalBot(connector, [
	function (session){
		 console.log("ChannelID = " + session.message.address.channelId);
		// start the conversation with log in
		signinbot.beginDialog(session);
		// end dialog and conversation if the  signbot returns authentication failure message
		// if authentication successful , then proceed with  next steps
		
	},
	function (session, results) {
        // prompt for search option
		var demochoices = demochoices1;
		// for cortana channel , give different demo choices
		if ( session.message.address.channelId == 'cortana'){
			demochoices = demochoices2;
		}
		
        builder.Prompts.choice(
            session,
            'Hi, I am a demo bot .. Please choose one of the demos from the list',
            demochoices,
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option',
                speak: 'Hi, I am a demo bot .. Please choose one of the demos from the list'
            });
    },
    function (session, results,  next) {
        if (!results.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // invoke worker bots based on user selection
        var selection = results.response.entity;
        switch (selection) {
            case DemoLabels.Echo:
                return echobot.beginDialog(session);
            case DemoLabels.Polyglot:
                return polyglotbot.beginDialog(session);
            case DemoLabels.Datacollector:
               return  datacollectorbot.beginDialog(session);
            case DemoLabels.QnA:
               return qnabot.beginDialog(session);
            case DemoLabels.Knowledge:
              return knowledgebot.beginDialog(session);
        }
        
    },
    
    function(session, results){
    	// check if the user wants to try more demos
    	builder.Prompts.confirm(session, "You successfuly completed the " + demoselection + " demo. Do want to try more demos ?",
        		{ speak: "Do want to try more demos ?",
	  		  retrySpeak:"Do want to try more demos ?",
	  		  inputHint: builder.InputHint.expectingInput
		});
    },
   
    function(session, results) {
    	
    	if (results.response){
    		
    		session.replaceDialog('/');
    	}
    		
    	else{
    		
    		session.say('Thank you for your time to watch my demos.. Bye..', 
    			    'Thank you for your time to watch my demos.. Bye..', 
    			    { inputHint: builder.InputHint.ignoringInput }
    			);
    		session.endDialog();
    	}
    		
    }
]);


// add demo helper functions


// add worker bots to maaster bot

bot.library(signinbot.createLibrary());
bot.library(echobot.createLibrary());
bot.library(polyglotbot.createLibrary());
bot.library(datacollectorbot.createLibrary());
bot.library(qnabot.createLibrary());
bot.library(knowledgebot.createLibrary());
bot.dialog('help', require('./workers/help'))
.triggerAction({
    matches: [/help/i, /support/i, /problem/i]
});

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

