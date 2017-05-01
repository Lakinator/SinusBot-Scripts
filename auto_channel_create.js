registerPlugin({
	name: "Auto Channel Create",
	version: "Version 1.1",
	description: "Wenn ein User in einen bestimmten Channel joint wird ein Temp Channel für ihn erstellt, dorthin gemovt und ihm Channel Admin gegeben",
	author: "Laki <lakinator.bplaced.net>",
	vars: {
		/*not_allowed_groups: {
			title: "Nicht zugelassene Clientgruppen",
			type: "array",
			vars: {
				group_id: {
					title: "Gruppen ID",
					type: "number"
				}
			}
		},*/
		channel_join: {
			title: "Channel in den der Client joinen muss",
			type: "channel"
		},
		channel_admin_id: {
			title: "Channel Admin Group ID",
			type: "number"
		}
	}
}, function(sinusbot, config){

	var engine = require('engine');
  	var backend = require('backend');
  	var event = require('event');

  	var waitTime = 0.75;


	event.on("clientMove", function(ev){
		setTimeout(function(){
			if (!ev.client.isSelf()) {

				if (ev.toChannel.id() == config.channel_join && ev.fromChannel.id() != config.channel_join) {
					engine.log("Neuer Channel von " + ev.client.name() + " gefordert");
					var create_channel = backend.getChannelByID(config.channel_join);
					var channel_name = ev.client.name() + "'s Channel";

					backend.createChannel({
	            		name: channel_name,
	            		position: backend.getChannelCount()+1,
	            		parent: "",
	            		permanent: false,
	            		semiPermanent: true,
	            		password: "",
	            		codec: 3,
	            		codecQuality: 6
	        		});

					var userChannel = backend.getChannelByName(channel_name);
	        		while(userChannel == undefined) {
	        			userChannel = backend.getChannelByName(channel_name);
	        		}

	        		ev.client.moveTo(userChannel, "");
	        		userChannel.setSemiPermanent(false);
	        		//backend.getBotClient().moveTo(create_channel, "");
	        		
	        		userChannel.setChannelGroup(ev.client, backend.getChannelGroupByID(config.channel_admin_id));

				}
			}
		}, waitTime * 1000);

	});

});