
/*-----------------------------------------------------------------------------

Routing Demo Bot that routes to various demos

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');

// include worker bots 
var signinbot = require('./demolib/signin');


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
	function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Do you want to have a demo?.. Please choose one in the list',
            [DemoLabels.Signin, DemoLabels.Echo,  DemoLabels.Polyglot, DemoLabels.Datacollector,
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

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DemoLabels.Signin:
                //return session.beginDialog('signin');
            	return signinbot.beginDialog(session);
            case DialogLabels.Echo:
                return session.beginDialog('echo');
            case DialogLabels.Polyglot:
                return session.beginDialog('polyglot');
            case DialogLabels.Datacollector:
                return session.beginDialog('datacollector');
            case DialogLabels.QnA:
                return session.beginDialog('qna');
            case DialogLabels.Knowledge:
                return session.beginDialog('knowledge');
                          
        }
    }
]);


//bot.dialog('signin', require('./demolib/signin'));
bot.library(signinbot.createLibrary());
bot.dialog('echo', require('./demolib/echo'));
bot.dialog('polyglot', require('./demolib/polyglot'));
bot.dialog('datacollector', require('./demolib/datacollector'));
bot.dialog('qna', require('./demolib/qna'));
//bot.dialog('knowledge', require('./demolib/knowledge'));
bot.dialog('help', require('./demolib/help'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});



