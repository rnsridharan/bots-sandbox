require('dotenv-extended').load();

require('./../config.js')();
//require('./../connectorSetup.js')();
require('./../searchHelpers.js')();
require('./../dialogs/results.js')(); 
require('./../dialogs/musicianExplorer.js')();
require('./../dialogs/musicianSearch.js')();


var request = require('request');

bot.use(builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }));

// Entry point of the bot
module.exports =   [
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
];



