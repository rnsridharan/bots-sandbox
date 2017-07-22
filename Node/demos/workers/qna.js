
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
//This loads the environment variables from the .env file
require('dotenv-extended').load();
var fs = require('fs');
var util = require('util');


//=========================================================
// Bot Setup
//=========================================================


var bot = new builder.UniversalBot(null, null, 'qnabot');

//Export createLibrary() function
exports.createLibrary = function () {
return bot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('qna:/');
}




//=========================================================
// Bots Dialogs
//=========================================================

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID, 
	subscriptionKey: process.env.SUBSCRIPTION_KEY,
	top: 4});

var qnaMakerTools = new cognitiveservices.QnAMakerTools();
builder.Library(qnaMakerTools.createLibrary());
	
var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'No match! Try changing the query terms!',
	qnaThreshold: 0.3,
	feedbackLib: qnaMakerTools
});

// Override to also include the knowledgebase question with the answer on confident matches
basicQnAMakerDialog.respondFromQnAMakerResult = function(session, qnaMakerResult){
	var result = qnaMakerResult;
	
	//var response = 'Here is the match from FAQ:  \r\n  Q: ' + result.answers[0].questions[0] + '  \r\n A: ' + result.answers[0].answer;
	//session.send(response);
	// include image
	sendRichAnswer(session, result.answers[0].answer,  './images/somnath.jpg', 'image/jpg', 'somnath.jpg');
	
}

// Override to log user query and matched Q&A before ending the dialog
basicQnAMakerDialog.defaultWaitNextMessage = function(session, qnaMakerResult){
	if(session.privateConversationData.qnaFeedbackUserQuestion != null && qnaMakerResult.answers != null && qnaMakerResult.answers.length > 0 
		&& qnaMakerResult.answers[0].questions != null && qnaMakerResult.answers[0].questions.length > 0 && qnaMakerResult.answers[0].answer != null){
			console.log('User Query: ' + session.privateConversationData.qnaFeedbackUserQuestion);
			console.log('KB Question: ' + qnaMakerResult.answers[0].questions[0]);
			console.log('KB Answer: ' + qnaMakerResult.answers[0].answer);
		}
	session.endDialog();
}

bot.dialog('/',  basicQnAMakerDialog);

//Sends attachment inline in base64
function sendRichAnswer(session, answer, filePath, contentType, attachmentFileName) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return session.send('Oops. Error reading file.');
        }

        var base64 = Buffer.from(data).toString('base64');

     // send a Hero card
    	var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
            new builder.HeroCard(session)
                .title("Avre Thinnal ")
                .subtitle("Sourashtra Covention 2017 ")
                .text(answer)
                .images([builder.CardImage.create(session, util.format('data:%s;base64,%s', contentType, base64))]
                )]);
        session.send(msg)
        /*
        var msg = new builder.Message(session)
            .addAttachment({
                contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                contentType: contentType,
                name: attachmentFileName
            });
            session.send(msg);*/

        
    });
}