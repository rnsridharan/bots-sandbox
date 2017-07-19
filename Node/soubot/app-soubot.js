
/*-----------------------------------------------------------------------------

A simple Sourashtra speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');
var ssml = require('./ssml');
//library functions for managing the locale
var localeTools = require('./lib/localeTools'); 
//library functions for managing the locale
var testUtils1 = require('./lib/testutils1'); 

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
	localeTools.chooseLocale(session);
	},
	function (session, results){

	    // invoke greetings
	    testUtils1.startGreetings(session);
	}
		
]);

//Add locale tools library to bot
bot.library(localeTools.createLibrary());

// Add testutils-1 library
bot.library(testUtils1.createLibrary());


//optionally Install language detection middleware. Follow instructions at:
//
//      https://azure.microsoft.com/en-us/documentation/articles/cognitive-services-text-analytics-quick-start/
//
// bot.use(localeTools.languageDetection(process.env.LANGUAGE_DETECTION_KEY));



