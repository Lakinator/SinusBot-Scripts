//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Teammitglieder Online Script',
	version: '2.0',
	description: 'Anzeige von Online Teammitgliedern',
	author: 'Laki <lakinator.bplaced.net>',
	vars: [
		{
			name: "online_group_objects",
			title: "Anzuzeigende Online Gruppen",
			type: "array",
			vars: [
	          	{
	            	name: 'group_id',
	            	title: 'ID von der Gruppe die dargestellt werden soll',
	            	type: 'number'
	          	}
          	]
		},
		{
			name: "channel_name",
			title: "Name des Channels mit %n als Platzhalter für die Anzahl",
			type: "string"
		},
		{
			name: "channel_info",
			title: "Channel der Teammitglieder (Der dann umbenannt wird)",
			type: "channel"
		}
	]
}, function(sinusbot, config){
	sinusbot.log("Teammitglieder Online script 2.0 geladen");

	var engine = require('engine');
  	var backend = require('backend');
  	var event = require('event');

  	var group_ids = [];
  	var online_infos = [];
  	var channel_display;  //Channel bei dem die Info displayed wird
  	var channel_name;  //Name für den Channel mit Platzhalter für die Anzahl

  	loadConfig();
  	firstUpdate();


  	event.on("clientMove", function(ev){
		
		//Client joined
		if (!ev.client.isSelf() && ev.fromChannel == undefined) {

			for (var i = 0; i < group_ids.length; i++) {
				if (hasGroup(ev.client, group_ids[i])) {
					engine.log(ev.client.name() + " || online");

					if (online_infos[i].client_ids.indexOf(ev.client.id()) == -1) {
						online_infos[i].client_ids.push(ev.client.id());
						online_infos[i].counter++;
					}
					
					engine.log(online_infos[i]);
					updateDesc();
				}
			}

		}

		//Client went offline
		if (!ev.client.isSelf() && ev.toChannel == undefined) {

			for (var i = 0; i < group_ids.length; i++) {
				if (hasGroup(ev.client, group_ids[i])) {
					engine.log(ev.client.name() + " || offline");

					if (online_infos[i].client_ids.indexOf(ev.client.id()) > -1) {
						online_infos[i].removeClient(ev.client.id());
						online_infos[i].counter--;
					}

					engine.log(online_infos[i]);
					updateDesc();
				}
			}

		}

	});



  	function loadConfig() {
	  	if (config.online_group_objects != undefined) {
		  	if(config.online_group_objects.length > 0) {
		  		for (var i = 0; i < config.online_group_objects.length; i++) {
		  			engine.log("ID: " + config.online_group_objects[i].group_id);
		  			group_ids[i] = config.online_group_objects[i].group_id;
		  			online_infos[i] = new onlineInfoObject(group_ids[i]);
		  		}
		  	}
	  	}

	  	channel_display = backend.getChannelByID(config.channel_info);
	  	channel_name = config.channel_name;
  	}

  	function firstUpdate() {
  		var clients = backend.getClients();
		clients.forEach(function(client) {
    		for (var i = 0; i < group_ids.length; i++) {
				if (hasGroup(client, group_ids[i])) {
					engine.log(client.name() + " || online");

					if (online_infos[i].client_ids.indexOf(client.id()) == -1) {
						online_infos[i].client_ids.push(client.id());
						online_infos[i].counter++;
					}
						
					engine.log(online_infos[i]);
				}
			}
		});

		updateDesc();
  	}

  	function updateDesc() {
  		var client;
  		var group;
  		var anzahl = 0;
  		var name = "";
  		var description = "";

  		for (var i = 0; i < online_infos.length; i++) {
  			group = backend.getServerGroupByID(online_infos[i].groupID);
  			anzahl += online_infos[i].counter;

  			for (var j = 0; j < online_infos[i].client_ids.length; j++) {
  				client = backend.getClientByID(online_infos[i].client_ids[j]);

  				description += "\n[b][color=green]" + group.name() + "[/color][/b] Online:\n";
  				description += "Der " + group.name() + " [URL=client://0/"+ client.uid() + "~" + client.name().replace(/ /g, "%") + "]" + client.name() +"[/URL]" + " ist online\n";
			}

			if (online_infos[i].client_ids.length == 0) {
				description += "Kein [b][color=red]" + group.name() + "[/color][/b] Online\n";
			}
		}

		channel_display.setName(channel_name.replace(/%n/g, anzahl));
		channel_display.setDescription(description);
  	}

  	function onlineInfoObject(groupID) {
  		this.groupID = groupID;
  		this.counter = 0;
  		this.client_ids = [];
  		this.removeClient = function(client_id) {
  			var index = this.client_ids.indexOf(client_id);

  			if (index > -1) {
    			this.client_ids.splice(index, 1);
			}
  		}
  	}

  	function hasGroup(cl, groupID) {
		var group;

		for (var index in cl.getServerGroups()) {
			group = cl.getServerGroups()[index];
			if(group.id() == groupID) return true;
		}

		return false;
	}


});