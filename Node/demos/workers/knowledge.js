require('dotenv-extended').load();
global.builder = require('botbuilder');

// create global knowledge bot
global.kbot = new builder.UniversalBot(null, null, 'knowledgebot');

require('./knowledge/config.js')();
require('./knowledge/searchHelpers.js')();
require('./knowledge/dialogs/results.js')(); 
require('./knowledge/dialogs/musicianExplorer.js')();
require('./knowledge/dialogs/musicianSearch.js')();

var request = require('request');

//Export createLibrary() function
exports.createLibrary = function () {
return kbot.clone();
}

exports.beginDialog = function(session){
	session.beginDialog('knowledgebot:/');
}


//kbot.use(builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

// Entry point of the bot
kbot.dialog('/', [
    function (session) {
        session.replaceDialog('/promptButtons');
    }
]);
        
kbot.dialog('/promptButtons',[
    function (session) {
        //var choices = ["Musician Explorer", "Musician Search"];
    	var choices = "Musician Explorer|Musician Search";
        builder.Prompts.choice(session, "How would you like to explore the classical music bot?", choices);
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Musician Explorer":
                    session.replaceDialog('/musicianExplorer');
                    break;
                case "Musician Search":
                    session.replaceDialog('/musicianSearch');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);



