/**
 * Utility library function for basic bot testing 
 */
var builder = require('botbuilder');
var lang = 'en';
var ssml = require('./../ssml/locale/' + lang + '/ssml');



var lib = new builder.Library('testutils1');

exports.createLibrary = function () {
 return lib;
}

exports.startGreetings = function (session, options){
	session.preferredLocale(session.preferredLocale());
	session.beginDialog('testutils1:greeting', options || {} );
}


lib.dialog('greeting',  [
    function (session) {
    		builder.Prompts.text(session, "text_prompt",
    				{ speak: session.gettext("text_prompt_ssml"),
       		  		  retrySpeak: session.gettext("text_prompt_ssml"),
       		  		  inputHint: builder.InputHint.expectingInput
    				});
    	   },
    	    function (session, results) {
    	        session.send("input_response", results.response);
    	        builder.Prompts.number(session, "number_prompt",
    	        	{ speak: session.gettext("number_prompt_ssml"),
       		  		  retrySpeak: session.gettext("number_prompt_ssml"),
       		  		  inputHint: builder.InputHint.expectingInput
    				});
    	    },
    	    function (session, results) {
    	        session.send("input_response", results.response);
    	        builder.Prompts.choice(session, "listStyle_prompt", "auto|inline|list|button|none",
    	        	{ speak: session.gettext("input_response_ssml"),
     		  		  retrySpeak: session.gettext("input_response_ssml"),
     		  		  inputHint: builder.InputHint.expectingInput
  				});
    	    },
    	    function (session, results) {
    	        // You can use the localizer manually to load a localized list of options.
    	        var style = builder.ListStyle[results.response.entity];
    	        var options = session.localizer.gettext(session.preferredLocale(), "choice_options");
    	        builder.Prompts.choice(session, "choice_prompt", options, { listStyle: style },
    	        	{ speak: session.gettext("choice_prompt_ssml"),
     		  		  retrySpeak: session.gettext("choice_prompt_ssml"),
     		  		  inputHint: builder.InputHint.expectingInput
  				});
    	    },
    	    function (session, results) {
    	        session.send("choice_response", results.response.entity);
    	        builder.Prompts.confirm(session, "choice_response",
    	        		{ speak: session.gettext("choice_response_ssml"),
   		  		  retrySpeak: session.gettext("choice_response_ssml"),
   		  		  inputHint: builder.InputHint.expectingInput
				});
    	    },
    	    function (session, results) {
    	        // You can use the localizer manually to load prompts from another namespace.
    	        var choice = results.response ? 'confirm_yes' : 'confirm_no';
    	        session.send("choice_response", session.localizer.gettext(session.preferredLocale(), choice, 'BotBuilder'));
    	        builder.Prompts.time(session, "time_prompt",
    	        	{ speak: session.gettext("time_prompt_ssml"),
     		  		  retrySpeak: session.gettext("time_prompt_ssml"),
     		  		  inputHint: builder.InputHint.expectingInput
  				});
    	    },
    	    function (session, results) {
    	        session.send("time_response", JSON.stringify(results.response),
    	        		{speak: session.gettext("time_response_ssml")}
    	        );
    	        session.endDialog("demo_finished", 
    	        		{speak: session.gettext("demo_finished_ssml")}
    	        );
    	    }
    	]);


/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}

