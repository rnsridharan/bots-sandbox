// Sourashtra Teacher Assistant 7/17/17


// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');
// adding ssml util - 7/17/17
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


var bot = new builder.UniversalBot(connector, function (session) {
    session.say('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});


/**
* Create your bot with a function to receive messages from the user.
* - This function will be called anytime the users utterance isn't
*   recognized.

var bot = new builder.UniversalBot(connector, function (session) {
   // Just redirect to our 'HelpDialog'.
   session.replaceDialog('HelpDialog');
});
*/

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

// add RegExpression recognizer
bot.recognizer(recognizer);


bot.dialog('TeachVowels', [
    function (session, args, next) {
        session.send('Welcome to Learning Sourashtra language');

        // try extracting entities
        var vowelEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Vowel');
        if (vowelEntity) {
            // vowel entity detected, continue to next step
            session.dialogData.searchType = 'vowel';
            next({ response: vowelEntity.entity });
       
        } else {
            // no entities detected, ask user for a destination
            //builder.Prompts.text(session, 'Please enter your destination');
        	builder.Prompts.text(session, 'Please select the teaching choice', {                                    
        	    speak: 'Please select the teaching choice',                                               
        	    retrySpeak: 'Sorry, I did not hear you. Please enter your choice',  
        	    inputHint: builder.InputHint.expectingInput                                              
        	});
        }
    },
    function (session, results) {
        var vowel = results.response;

          	saymessage = "Teaching vowels"
        // compose message to speak
          
        session.say(saymessage);
 
        // End
                session.endDialog();
            });
    }
]).triggerAction({
    matches: 'TeachVowels',
    onInterrupted: function (session) {
      session.say('Please choose Teachwords or TeachVowels' );
    }
});

bot.dialog('TeachWords', function (session, args) {
    // retrieve hotel name from matched entities
    var wordsEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Words');
    if (wordsEntity) {
        saymessage = 'Looking for list of ' + words.entity;
        session.say(saymessage);
        Store.searchHotelReviews(hotelEntity.entity)
            .then(function (reviews) {
                var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(reviews.map(reviewAsAttachment));
                session.endDialog(message);
            });
    }
}).triggerAction({
    matches: 'TeachWords'
});

bot.dialog('Help', function (session) {
    session.endDialog('Please select eithet Teach Vowels or Teach Words');
}).triggerAction({
    matches: 'Help'
});

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

// Helpers
function vowelAsAttachment(vowel) {
    return new builder.HeroCard()
        .title(hotel.name)
        .subtitle(hotel.name)
        .images([new builder.CardImage().url(vowel.image)])
        .buttons([
            new builder.CardAction()
                .title('More details')
                .type('openUrl')
                .value('https://www.google.com))
        ]);
}

function wordAsAttachment(word) {
    return new builder.ThumbnailCard()
        .title(word.title)
        .text(word.text)
        .images([new builder.CardImage().url(word.image)]);
}

;

