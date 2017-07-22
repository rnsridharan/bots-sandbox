
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

var bot = new builder.UniversalBot(connector, [
	function (session){
		// start the conversation with log in
		signinbot.beginDialog(session);
		// end dialog and conversation if the  signbot returns authentication failure message
		// if authentication successful , then proceed with  next steps
		
	},
	function (session, results) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Do you want to have a demo?.. Please choose one of the demos from the list',
            [DemoLabels.Echo,  DemoLabels.Polyglot, DemoLabels.Datacollector,
            	 DemoLabels.QnA, DemoLabels.Knowledge],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
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
        var selection = result.response.entity;
        switch (selection) {
            case DemoLabels.Echo:
                return echobot.beginDialog(session);
            case DemoLabels.Polyglot:
                return polyglotbot.beginDialog(session);
            case DemoLabels.Datacollector:
                return datacollectorbot.beginDialog(session);
            case DemoLabels.QnA:
                return qnabot.beginDialog(session);
            case DemoLabels.Knowledge:
                return knowledgebot.beginDialog(session);
                          
        }
    }
]);


// add worker bots to maaster bot

//bot.dialog('signin', require('./demolib/signin'));
bot.library(signinbot.createLibrary());
//bot.dialog('echo', require('./demolib/echo'));
bot.library(echobot.createLibrary());
//bot.dialog('polyglot', require('./demolib/polyglot'));
bot.library(polyglotbot.createLibrary());
//bot.dialog('datacollector', require('./demolib/datacollector'));
bot.library(datacollectorbot.createLibrary());
//bot.dialog('qna', require('./demolib/qna'));
bot.library(qnabot.createLibrary());
//bot.dialog('knowledge', require('./demolib/knowledge'));
bot.library(knowledgebot.createLibrary());
bot.dialog('help', require('./workers/help'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});



