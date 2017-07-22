
/*-----------------------------------------------------------------------------

A simple Sourashtra speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
//default English ssml file
var ssml = require('./../lib/ssml/locale/en/ssml');

//library functions for managing the locale
var localeTools = require('./../lib/utils/localeTools'); 
//library functions for managing the locale
var testUtils1 = require('./../lib/utils/testutils1'); 


var bot = new builder.UniversalBot(null, null, 'polyglotbot');

//Export createLibrary() function
exports.createLibrary = function () {
return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('polyglotbot:chooseLocale');
}


bot.dialog('chooseLocale', [
	function (session) {
	// set locale
	localeTools.chooseLocale(session);	
		},
	function (session, results){
		console.log("User selected locale - " + session.preferredLocale());

	    // invoke greetings
	    testUtils1.startGreetings(session);
	}
		
]);

//Add locale tools library to bot
builder.Library(localeTools.createLibrary());

// Add testutils-1 library
builder.Library(testUtils1.createLibrary());




