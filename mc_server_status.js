//SinusBot Version 0.9.15
//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Minecraft Server Status',
	version: '1.0',
	description: 'Zeigt den Status von Minecraft Servern in einer Channel Beschreibung an oder einen bestimmten Server mit dem Command: !server <serveraddresse>',
	author: 'Laki <lakinator.bplaced.net>',
	vars: {
		a_mc_server: {
			title: "Die Server die in der Channelbeschreibung angezeigt werden (durch Komma getrennt und ohne Leerzeichen)",
			type: "string"
		},
		b_mc_channel: {
			title: "Channel, bei dem die Serverdaten in der Beschreibung angezeigt werden",
			type: "channel"
		},
		c_schrift_size: {
			title: "Schriftgröße der Channel Beschreibung",
			type: "number"
		},
		d_admins: {
			title: "Admin UIDs, für die Reload-Funktion (durch Komma getrennt und ohne Leerzeichen)",
			type: "string"
		},
		e_command: {
			title: "Command zum Reloaden der Channel Description (Groß und Kleinschreibung wird beachtet!)",
			type: "string"
		}
	}
}, function(sinusbot, config){

	//Nützliche Methode

	if (!String.prototype.startsWith) {
    	String.prototype.startsWith = function(searchString, position) {
    		position = position || 0;
    		return this.indexOf(searchString, position) === position;
    	};
    }

	sinusbot.log("mc_server_status Plugin geladen");
	var server_list = config.a_mc_server.split(",");
	var admins = config.d_admins.split(",");
	var channel_desc = "[size=" + config.c_schrift_size + "]Minecraft Server Status:\n\n";
	var canReload = false;

	for (var i = server_list.length - 1; i >= 0; i--) {
			updateChannelDesc(server_list[i]);
	}

	//Anschreib Funktion, der die Server Informationen zurückgibt

	sinusbot.on("chat", function(event){

		if (event.msg.startsWith("!server ")) {
			var server = event.msg.replace(/!server /g, "");
			checkServer(server, event.clientId);
		} else if (event.msg == config.e_command) {
			canReload == false;
			for (var i = admins.length - 1; i >= 0; i--) {
				if (event.clientUid == admins[i]) {
					canReload == true;
					channel_desc = "[size=" + config.c_schrift_size + "]Minecraft Server Status:\n\n";
					for (var f = server_list.length - 1; f >= 0; f--) {
						updateChannelDesc(server_list[f]);
					}
				}
			}
		}
	});

	//Hauptaktualisierungs Schleife

	setInterval(function() {
		channel_desc = "[size=" + config.c_schrift_size + "]Minecraft Server Status:\n\n";

		for (var i = server_list.length - 1; i >= 0; i--) {
			updateChannelDesc(server_list[i]);
		}

    }, 300000); //5 min = 300 000 | 15 min = 900 000

	//Hauptfunktionen

	function checkServer(serverIP, channelID) {
	    sinusbot.http({
	      "method": "GET",
	      "url":    "https://mcapi.ca/query/" + serverIP + "/info/old",
	      "timeout": 60000,
	      "headers": [
	        {"Content-Type": "application/json"}
	      ]
	    }, function (error, response) {
	    	var serverinfo = JSON.parse(response.data);

	    	if (serverinfo.status) {
	    		sinusbot.chatPrivate(channelID, "Auf dem Minecraft Server mit der IP: [color=blue]" + serverIP + "[/color] und der Version: [color=purple]" + serverinfo.version + "[/color] sind [color=green]" + serverinfo.players.online + "[/color] Spieler von [color=red]" + serverinfo.players.max + "[/color] online");
	    	} else if (!serverinfo.status) {
	    		sinusbot.chatPrivate(channelID, "Der Minecraft Server mit der IP: [color=blue]" + serverIP + "[/color] ist [color=red]offline[/color] oder [color=red]nicht erreichbar[/color]");
	    	}
	       
	    });
    }

    function updateChannelDesc(serverIP) {
	    sinusbot.http({
	      "method": "GET",
	      "url":    "https://mcapi.ca/query/" + serverIP + "/info/old",
	      "timeout": 60000,
	      "headers": [
	        {"Content-Type": "application/json"}
	      ]
	    }, function (error, response) {
	    	var serverinfo = JSON.parse(response.data);

	    	if (serverinfo.status) {
	    		channel_desc += "[b][color=blue]" + serverIP + "[/color][/b]:\n  Version: [color=purple]" + serverinfo.version + "[/color] | Es sind [color=green]" + serverinfo.players.online + "[/color] Spieler von [color=red]" + serverinfo.players.max + "[/color] online\n\n";
	    		channelUpdate(config.b_mc_channel, {description: channel_desc + "[/size]"});
	    	} else if (!serverinfo.status) {
	    		channel_desc += "[b][color=blue]" + serverIP + "[/color][/b]:\n  Status: [color=red]Offline oder nicht erreichbar[/color]\n\n";
	    		channelUpdate(config.b_mc_channel, {description: channel_desc + "[/size]"});
	    	}
	    });
    }
});