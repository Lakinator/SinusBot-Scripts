//SinusBot Version 0.9.16 Windows
//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Ruhe Script (Neue API)',
	version: '1.0',
	description: 'Bot anschreiben mit einem festlegbaren Command um die Servergruppe Ruhe zu bekommen oder zu entfernen',
	author: 'Laki <lakinator.bplaced.net>',
	vars: {
		servergroupID: {
			title: 'Servergruppen ID der Ruhe Gruppe',
			type: 'number'
		},
		command: {
			title: 'Command auf den der Bot reagiert (Groß und Kleinschreibung ist egal)',
			type: 'string'
		}
	}
}, function(sinusbot, config) {
	var event = require("event");
	var engine = require("engine");
	var backend = require("backend");
	var format = require("format");

	var cmd = config.command.toUpperCase();
	var groupID = ""+config.servergroupID;
	var hasGroup;

	event.on("chat", function(ev) {
		hasGroup = false;

		if (ev.text.toUpperCase() == cmd) {

			ev.client.getServerGroups().forEach(function(group) {
				if (group.id() == groupID) {
					ev.client.removeFromServerGroup(groupID);
					ev.client.chat("\n\t\t\t\tDu wurdest von der Gruppe " + format.color(backend.getServerGroupByID(groupID).name(), "#0668d8") + format.color(" entfernt", "#d60808") + "\n\t\t\t\tSchreibe den Bot erneut an um die Gruppe wieder zu bekommen");
					hasGroup = true;
				}
        	});

			if (!hasGroup) {
				ev.client.addToServerGroup(groupID);
				ev.client.chat("\n\t\t\t\tDu hast jetzt die Gruppe " + format.color(backend.getServerGroupByID(groupID).name(), "#0668d8") + format.color(" bekommen", "#02e54e") + "\n\t\t\t\tDu wirst nun nicht mehr genervt auf dem TeamSpeak\n\t\t\t\tSchreibe den Bot erneut an um die Gruppe wieder zu entfernen");
			}
		}
	});

});