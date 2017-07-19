/**
 * Library functions for locale management 
 */

var builder = require('botbuilder');
var request = require('request');
var lang = 'en';
var ssml = require('./../ssml/locale/' + lang + '/ssml');

//=========================================================
//Library creation
//=========================================================

var lib = new builder.Library('localeTools');

exports.createLibrary = function () {
	 return lib;
}



//Add locale picker dialog 
exports.chooseLocale = function (session, options) {
	// Start dialog in libraries namespace
    session.beginDialog('localeTools:chooseLocale', options || {});
}


lib.dialog('chooseLocale', [
    function (session) {
    	session.send("greeting");
    	session.send("instructions");
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
                locale = 'sa';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog('locale_updated_ssml', 
                		speak(session, 'locale_updated_ssml'));
            	console.log('speaking in ' + locale);
            	
            } else {
                // Problem loading the selected locale
                session.error(err);
                speak(session,'err_prompt');
            }
        });
    }
]);

//=========================================================
//Language Detection Middleware
//=========================================================

exports.languageDetection = function (apiKey) {
 if (!apiKey) {
     console.warn('No API Key passed to localeTools.languageDetection().');
 }
 return {
     receive: function (event, next) {
         if (apiKey && event.text && !event.textLocale) {
             var options = {
                 method: 'POST',
                 url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages?numberOfLanguagesToDetect=1',
                 body: { documents: [{ id: 'message', text: event.text }]},
                 json: true,
                 headers: {
                     'Ocp-Apim-Subscription-Key': apiKey
                 }
             };
             request(options, function (error, response, body) {
                 if (!error) {
                     if (body && body.documents && body.documents.length > 0) {
                         var languages = body.documents[0].detectedLanguages;
                         if (languages && languages.length > 0) {
                             event.textLocale = languages[0].iso6391Name;
                         }
                     }
                 }
                 next();
             });
         } else {
             next();
         }
     }
 };
}

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}

