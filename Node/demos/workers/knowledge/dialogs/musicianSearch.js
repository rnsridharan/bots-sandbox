module.exports = function () {
    kbot.dialog('/musicianSearch', [
        function (session) {
            //Prompt for string input
            builder.Prompts.text(session, "Type in the name of the musician you are searching for:");
        },
        function (session, results , next) {
            //Sets name equal to resulting input
            var name = results.response;

            var queryString = searchQueryStringBuilder('search= ' + name);
            performSearchQuery(queryString, function (err, result) {
                if (err) {
                    console.log("Error when searching for musician: " + err);
                } else if (result && result['value'] && result['value'][0]) {
                    //If we have results send them to the showResults dialog (acts like a decoupled view)
                    //session.replaceDialog('/showResults', { result });
                	session.beginDialog('/showResults', { result });
                } else {
                    //session.endDialog("No musicians by the name \'" + name + "\' found");
                	session.send("No musicians by the name \'" + name + "\' found.. Please try some other name");
                	next();
                }
            });
        },
        function (session, results) {
       	 // check if the user wants to try more demos
               builder.Prompts.confirm(session, "Would you like to try more MusicanSearch ? Please say or enter Yes or No",
               		{ speak: "Would you like to try more MusicanSearch ? Please say or enter Yes or No",
       	  		  retrySpeak:"Would you like to try more MusicanSearch ? Please say or enter Yes or No",
       	  		  inputHint: builder.InputHint.expectingInput
       		});
           },
        function(session, results) {
           	
           	if (results.response){            		
           		session.replaceDialog('/musicianSearch');
           	}
           		
           	else {
           			session.endDialog("Thank you for trying out MusicanSearch..",
               			{speak: "Thank you for trying out MusicanSearch"
               			});
           	}
           		
       }
    ]);
}

