/**
 * Utility library function for testing Rich card and other message features 
 */
var builder = require('botbuilder');
var lang = 'en';
var ssml = require('./../ssml/locale/' + lang + '/ssml');


var namespace = 'testutils2_sou';
var lib = new builder.Library(namespace);


exports.createLibrary = function () {
 return lib;
}

exports.startDisplayRichcards = function (session, options){
	session.send("Displaying Rich cards");
	session.beginDialog(namespace + ':displayVowels', options || {} );
}


lib.dialog('displayVowels',  [
    function (session) {
    	console.log("displaying Vowels");
    	var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
            new builder.HeroCard(session)
                .title("ajunu - அ  ")
                .subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
                .text("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
                .images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/vowels-a.png')]
                ),
             new builder.HeroCard(session)
        		.title("ajunu - ஆ  ")
        		.subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - ஆ ")
        		.text("சௌரஷ்ட்ரா உயிர் எழுத்து - ஆ ")
        		.images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/vowels-aa.png')]
        		),
        		new builder.HeroCard(session)
            .title("ajunu - அ  ")
            .subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .text("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/vowels-e.png')]
            ),
            new builder.HeroCard(session)
            .title("ajunu - அ  ")
            .subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .text("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/vowels-ee.png')]
            ),
            new builder.HeroCard(session)
            .title("ajunu - அ  ")
            .subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .text("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/nitisambu-1.png')]
            ),
            new builder.HeroCard(session)
            .title("ajunu - அ  ")
            .subtitle("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .text("சௌரஷ்ட்ரா உயிர் எழுத்து - அ ")
            .images([builder.CardImage.create(session, 'http://bot-media-files.s3-website-us-west-2.amazonaws.com/images/nitisambu-2.png')]
            ),
            ]);
        session.send(msg).endDialog();
    }]);

lib.dialog('displayAdaptivecards',  [
    function (session) {
    	console.log("displaying Adaptive cards");
    	var msg = new builder.Message(session)
        .addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                type: "AdaptiveCard",
                speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
                   body: [
                        {
                            "type": "TextBlock",
                            "text": "Adaptive Card design session",
                            "size": "large",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Conf Room 112/3377 (10)"
                        },
                        {
                            "type": "TextBlock",
                            "text": "12:30 PM - 1:30 PM"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Snooze for"
                        },
                        {
                            "type": "Input.ChoiceSet",
                            "id": "snooze",
                            "style":"compact",
                            "choices": [
                                {
                                    "title": "5 minutes",
                                    "value": "5",
                                    "isSelected": true
                                },
                                {
                                    "title": "15 minutes",
                                    "value": "15"
                                },
                                {
                                    "title": "30 minutes",
                                    "value": "30"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.Http",
                            "method": "POST",
                            "url": "http://foo.com",
                            "title": "Snooze"
                        },
                        {
                            "type": "Action.Http",
                            "method": "POST",
                            "url": "http://foo.com",
                            "title": "I'll be late"
                        },
                        {
                            "type": "Action.Http",
                            "method": "POST",
                            "url": "http://foo.com",
                            "title": "Dismiss"
                        }
                    ]
            }
        });
        session.send(msg).endDialog();
    }])
    .triggerAction({ matches: /^(show|list)/i });;


