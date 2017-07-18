
/*-----------------------------------------------------------------------------

A simple Sourashtra speaking bot that can be run from a console window.

-----------------------------------------------------------------------------*/

// This loads the environment variables from the .env file
require('dotenv-extended').load();
var restify = require('restify');
var builder = require('botbuilder');
var ssml = require('./ssml');

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
        session.send("greeting");
        session.send("instructions");
        session.beginDialog('localePickerDialog');
    },
    function (session) {
        builder.Prompts.text(session, "text_prompt_ssml", 
        		{speak: speak(session, 'text_prompt_ssml'),
        		inputHint: builder.InputHint.ignoringInput 
        		});
    },
    function (session, results) {
    	session.say('input_response_ssml'+results.response, 
    			{speak: speak(session, results.response),
    		inputHint: builder.InputHint.ignoringInput 
    		});

        //session.send("input_response", results.response);
        builder.Prompts.number(session, "number_prompt_ssml",
        		{speak: speak(session, 'number_prompt_ssml'),
    		inputHint: builder.InputHint.ignoringInput 
    		});
    },
    function (session, results) {
    	session.say('input_response_ssml'+results.response, 
    			{speak: speak(session, results.response+''),
    			inputHint: builder.InputHint.ignoringInput 
    			});
       // session.send("input_response", results.response);
        builder.Prompts.choice(session, "listStyle_prompt", "auto|inline|list|button|none",
        { speak: speak(session, 'listStyle_prompt_ssml'),
   		  retrySpeak: speak(session, 'listStyle_prompt_ssml'),
   		  inputHint: builder.InputHint.expectingInput
   		});
    },
    function (session, results) {
        // You can use the localizer manually to load a localized list of options.
        var style = builder.ListStyle[results.response.entity];
        var options = session.localizer.gettext(session.preferredLocale(), "choice_options");
        builder.Prompts.choice(session, "choice_prompt", options, { listStyle: style },
        		 { speak: speak(session, 'choice_prompt_ssml'),
     		  retrySpeak: speak(session, 'choice_prompt_ssml'),
     		  inputHint: builder.InputHint.expectingInput
     		});
    },
    function (session, results) {
    	session.say('choice_response_ssml'+results.response, 
    			{speak: speak(session, results.response),
    		inputHint: builder.InputHint.ignoringInput 
    		});
       // session.send("choice_response", results.response.entity);
        builder.Prompts.confirm(session, "confirm_prompt",
        		 { speak: speak(session, 'confirm_prompt_ssml'),
   		  retrySpeak: speak(session, 'confirm_prompt_ssml'),
   		  inputHint: builder.InputHint.expectingInput
   		});
    },
    function (session, results) {
        // You can use the localizer manually to load prompts from another namespace.
        var choice = results.response ? 'confirm_yes' : 'confirm_no';
        session.say('choice_response_ssml'+results.response, 
    			{speak: speak(session, results.response),
    		inputHint: builder.InputHint.ignoringInput 
    		});
        //session.send("choice_response", session.localizer.gettext(session.preferredLocale(), choice, 'BotBuilder'));
        builder.Prompts.time(session, "time_prompt",
        		 { speak: speak(session, 'time_prompt_ssml'),
     		  retrySpeak: speak(session, 'time_prompt_ssml'),
     		  inputHint: builder.InputHint.expectingInput
     		});
    },
    function (session, results) {
    	session.say('time_response_ssml'+results.response, 
    			{speak: speak(session, results.response),
    		inputHint: builder.InputHint.ignoringInput 
    		});
        //session.send("time_response", JSON.stringify(results.response));
        
    	ession.say('demo mujjo', 
    			{speak: speak(session, 'demo mujjo'),
    		inputHint: builder.InputHint.ignoringInput 
    		});
    	//session.endDialog("demo_finished");
    }
]);

    
//Configure bots default locale and locale folder path.

/*
 * bot.set('localizerSettings', {
    botLocalePath: "./locale", 
    defaultLocale: "en" 
});
*/

//Add locale picker dialog 

bot.dialog('localePickerDialog', [
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
                locale = 'sa';
                break;
        }
        session.preferredLocale(locale, function (err) {
            if (!err) {
                // Locale files loaded
                session.endDialog(speak(session, 'locale_updated_ssml'));
            	console.log('speaking in ' + locale);
            	
            } else {
                // Problem loading the selected locale
                session.error(err);
                speak(session,'err_prompt');
            }
        });
    }
]);


/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}