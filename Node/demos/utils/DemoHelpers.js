/**
 * Library of helper functions
 */
var builder = require('botbuilder');
var lang = 'en';
var ssml = require('./../lib/ssml/locale/' + lang + '/ssml');
var fs = require('fs');
var util = require('util');


/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
exports.speak = function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log('Localised speech  ' + localized);
    return ssml.speak(localized);
}

 //Sends responses using Rich card
exports.sendRichResponse = function sendRichAnswer(session, responsedetails) {
    fs.readFile(responsedetails.filePath, function (err, data) {
        if (err) {
            return session.send('Oops. Error reading file.');
        }

        
        var base64 = Buffer.from(data).toString('base64');
        
     // send a Hero card
    	var msg = new builder.Message(session);
        var card = new builder.HeroCard(session)
        .title(responsedetails.title)
        .subtitle(responsedetails.subtitle)
        .text(responsedetails.answer)
        .images([builder.CardImage.create(session, util.format('data:%s;base64,%s', responsedetails.contenttype, base64))])
        .buttons([
            builder.CardAction.imBack(session, 'repeat', 'Repeat ? ')            
        ]);
        // optional layout setup
        // msg.attachmentLayout(builder.AttachmentLayout.carousel)
        
       msg.addAttachment(card);
      
       session.send(msg);
        
        /*
    var msg = new builder.Message(session)
        .speak(speak(session, 'I\'m roller, the dice rolling bot. You can say \'roll some dice\''))
        .addAttachment(card)
        .inputHint(builder.InputHint.acceptingInput); // Tell Cortana to accept input
    session.send(msg).endDialog();*/

       })
}
