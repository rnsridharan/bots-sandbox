/**
 * Library functions for locale management 
 */

var builder = require('botbuilder');
var request = require('request');
var lang = 'en';
var ssml = require('./../ssml/locale/' + lang + '/ssml');

//=========================================================
//Library bot creation
//=========================================================

var bot = new builder.UniversalBot(null, null, 'localeTools');

//Export createLibrary() function
exports.createLibrary = function () {
return bot.clone();
}

exports.beginDialog = function(session, options){
	// Start dialog in libraries namespace
    session.beginDialog('localeTools:chooseLocale', options || {});
}


bot.dialog('chooseLocale', [
    function (session) {
    	builder.Prompts.text(session,"greeting" ,
    			{speak: speak(session, "greeting"),
    			inputHint: builder.InputHint.acceptingInput
    			});
    },
    function (session, results, next) {
    	builder.Prompts.text(session, "instructions",
    			{speak: speak(session, "instructions"),
    			inputHint: builder.InputHint.acceptingnput
    			});
    	next();
    	},
    function (session, results) {
    	// Prompt the user to select their preferred locale
    	 builder.Prompts.choice(session, "locale_prompt", 'English|Español|Italiano|Sourashtra',
         		{ speak: speak(session, "locale_prompt"),
         		  retrySpeak: speak(session, "locale_prompt"),
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
                session.endDialog('locale_updated', 
                		speak(session, 'locale_updated'));
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

