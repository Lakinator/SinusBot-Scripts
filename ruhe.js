registerPlugin({
	name: 'Ruhe Script',
	version: '1.0',
	description: 'Bot anschreiben mit !ruhe um die Servergruppe Ruhe zu bekommen oder zu entfernen',
	author: 'Laki <lakinator.bplaced.net>',
	vars: {
		servergroupID: {
			title: 'Servergroup ID',
			type: 'number'
		},
		debug: {
			title: 'Debug aktivieren?',
			type: 'select',
			options: ['Ja', 'Nein'] //Ja = 0, Nein = 1;
		}
	}
}, function(sinusbot, config){

	sinusbot.on("chat", function(event){
		var wasAfk = false;
		event.msg = event.msg.toLowerCase();
		event.msg = event.msg.trim();

		if (event.msg == "!ruhe") {
			if (config.debug == 0) sinusbot.log("Command erkannt");
			
			for (var f = event.clientServerGroups.length - 1; f >= 0; f--) {
				if (event.clientServerGroups[f]["i"] == config.servergroupID) {
					wasAfk = true;
				}
			}

			if (!wasAfk) {
				sinusbot.addClientToServerGroup(event.client.dbid, config.servergroupID);
				if (config.debug == 0) sinusbot.log(event.clientNick + " wurde zu der Gruppe " + config.servergroupID + " hinzugefügt");
			} else if (wasAfk) {
				sinusbot.removeClientFromServerGroup(event.client.dbid, config.servergroupID);
				if (config.debug == 0) sinusbot.log(event.clientNick + " wurde aus der Gruppe " + config.servergroupID + " entfernt");
			}
		}
	});
});