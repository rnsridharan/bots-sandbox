/**
 * Utility library function for basic bot testing 
 */
var builder = require('botbuilder');
var ssml = require('./../ssml');


// Create your bot with a function to receive messages from the user

// ensure that each bot being federated over has a unique library name.
var bot = new builder.UniversalBot(null, null, 'testutils1');

// Export createLibrary() function
exports.createLibrary = function () {
    return bot.clone();
}

exports.startGreetings = function (session, options){
	session.beginDialog('testutils1:greeting', options || {} );
}


bot.dialog('greeting',  [
    function (session) {
        session.send("greeting");
        session.send("instructions");
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

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}

