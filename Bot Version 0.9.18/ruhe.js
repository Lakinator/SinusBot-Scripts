//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Ruhe Script',
	version: '1.1',
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
		},
		na_groups: {
			title: 'Nicht erlaubte Servergruppen IDs, ohne Leerzeichen mit Komma getrennt',
			type: 'string'
		}
	}
}, function(sinusbot, config) {
	var event = require("event");
	var engine = require("engine");
	var backend = require("backend");
	var format = require("format");

	var cmd = config.command.toUpperCase().trim();
	var groupID = ""+config.servergroupID;

	event.on("chat", function(ev) {
		
		if (ev.text.toUpperCase().trim() == cmd) {

			if (!hasNotAllowedServerGroup(ev.client)) {
				if (!hasGroup(ev.client, groupID)) {
					ev.client.addToServerGroup(groupID);
					ev.client.chat("\n\t\t\t\tDu hast jetzt die Gruppe " + format.color(backend.getServerGroupByID(groupID).name(), "#0668d8") + format.color(" bekommen", "#02e54e") + "\n\t\t\t\tDu wirst nun nicht mehr genervt auf dem TeamSpeak\n\t\t\t\tSchreibe den Bot erneut an um die Gruppe wieder zu entfernen");
				} else {
					ev.client.removeFromServerGroup(groupID);
					ev.client.chat("\n\t\t\t\tDu wurdest von der Gruppe " + format.color(backend.getServerGroupByID(groupID).name(), "#0668d8") + format.color(" entfernt", "#d60808") + "\n\t\t\t\tSchreibe den Bot erneut an um die Gruppe wieder zu bekommen");
				}	
			}


		}
		
	});

	function hasGroup(cl, groupID) {
		var group;

		for (var index in cl.getServerGroups()) {
			group = cl.getServerGroups()[index];
			if(group.id() == groupID) return true;
		}
			
		return false;
	}

	function hasNotAllowedServerGroup(cl) {
		var na_ids = config.na_groups.split(",");
		var group;

		for (var index in cl.getServerGroups()) {

			group = cl.getServerGroups()[index];

			if(na_ids instanceof Array) {
				for (var id in na_ids) {
					if(na_ids[id] == group.id()) {
						cl.chat("Du bist in der Servergruppe [color=red]" + group.name() + "[/color], deshalb darfst du den [color=blue]Ruhe[/color] Command noch nicht nutzen!");
						return true;
					}
				}
			} else {
				if(na_ids == group.id()) {
					cl.chat("Du bist in der Servergruppe [color=red]" + group.name() + "[/color], deshalb darfst du den [color=blue]Ruhe[/color] Command noch nicht nutzen!");
					return true;
				}
			}

		}

		return false;
	}

});
