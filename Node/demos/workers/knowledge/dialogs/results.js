module.exports = function () {
    kbot.dialog('/showResults', [
        function (session, args) {
        	session.dialogData.name = args.dialogName;
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
                args.result['value'].forEach(function (musician, i) {
                    msg.addAttachment(
                        new builder.HeroCard(session)
                            .title(musician.Name)
                            .subtitle("Era: " + musician.Era + " | " + "Search Score: " + musician['@search.score'])
                            .text(musician.Description)
                            .images([builder.CardImage.create(session, musician.imageURL)])
                    );
                })
                //session.endDialog(msg);
                
                session.send(msg);
             // check if the user wants to try more demos
                builder.Prompts.confirm(session, "Would you like to try more " + args.dialogName +  " ? Please say or enter Yes or No",
                		{ speak: "Would you like to try more" + args.dialogName + " ? Please say or enter Yes or No",
        	  		  retrySpeak:"Would you like to try more" + args.dialogName + "  ? Please say or enter Yes or No",
        	  		  inputHint: builder.InputHint.expectingInput
        		});
                
        },
        function(session, results,args) {
        	
        	var replaceDialog = '/' + session.dialogData.name ;
        	
        	if (results.response){            		
        		session.replaceDialog(replaceDialog);
        	}
        		
        	else {
        			session.endDialog("Thank you for trying out "  + session.dialogData.name  + "..",
            			{speak: "Thank you for trying out "  + session.dialogData.name  
            			});
        	}
        		
    }
        
    ])
}