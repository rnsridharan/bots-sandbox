
/*-----------------------------------------------------------------------------

A simple Sourashtra speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');
//default English ssml file
var ssml = require('./lib/ssml/locale/en/ssml');

//library functions for managing the locale
//var localeTools = require('./lib/utils/localeTools'); 
//library functions for managing the locale
var testUtils2 = require('./lib/utils/testutils2'); 

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
	// set locale
	//localeTools.chooseLocale(session);
		testUtils2.startDisplayRichcards(session);
		}
		
]);

//Add locale tools library to bot
//bot.library(localeTools.createLibrary());

// Add testutils-1 library
bot.library(testUtils2.createLibrary());




