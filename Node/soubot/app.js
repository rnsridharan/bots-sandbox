
/*-----------------------------------------------------------------------------

A simple Sourashtra speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');
//var ssml = require('./ssml');

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


// Create your bot with a function to receive messages from the user

var bot = new builder.UniversalBot(connector, [

    function (session) {
        // Prompt the user to select their preferred locale
        builder.Prompts.choice(session, "locale_prompt", 'English|Español|Italiano|Sourashtra',
        		{ speak: "What's your preferred language",
        		  retrySpeak: "What's your preferred language",
        		  inputHint: builder.InputHint.expectingInput
        		});
    },
    function (session, results) {
        // Update preferred locale
        var locale;
        switch (results.response.entity) {
            case 'English':
                locale = 'en';
                break;
            case 'Español':
                locale = 'es';
                break;
            case 'Italiano':
                locale = 'it';
                break;
            case 'Sourashtra':
                locale = 'saz';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog('locale_updated');
            } else {
                // Problem loading the selected locale
                session.erro(err);
            }
        });
    }
]);
    
//Configure bots default locale and locale folder path.

bot.set('localizerSettings', {
    botLocalePath: "./locale", 
    defaultLocale: "en" 
});
