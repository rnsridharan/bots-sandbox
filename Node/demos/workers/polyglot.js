
/*-----------------------------------------------------------------------------

A simple multi lingual speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');

//library functions for managing the locale
var localeTools = require('./../lib/utils/localeTools'); 
//library functions for managing the locale
var polyglotTester = require('./../lib/utils/polyglotTester'); 


var bot = new builder.UniversalBot(null, null, 'polyglotbot');

//Export createLibrary() function
exports.createLibrary = function () {
return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('polyglotbot:speakLocale');
}


bot.dialog('speakLocale', [
	function (session) {
	// set locale
	localeTools.beginDialog(session);	
		},
	function (session, results){
		console.log("User selected locale - " + session.preferredLocale());

	    // invoke greetings
	    polyglotTester.beginDialog(session);
	}
		
]);

//Add locale tools library to bot
// builder.Library(localeTools.createLibrary());
bot.library(localeTools.createLibrary());

// Add testutils-1 library
//builder.Library(testUtils1.createLibrary());
bot.library(polyglotTester.createLibrary());





