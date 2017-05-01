//SinusBot Version 0.9.15
//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: "Neue Clients Script",
	version: "1.0",
	description: "Gibt einem neuen Client nach dem x-ten mal connecten eine neue Servergruppe",
	author: "Laki <lakinator.bplaced.net>",
	vars: {
		a_newServergroup: {
			title: "Servergruppe die dem Nuzer gegeben wird nach x-ten mal connecten",
			type: "number"
		},
		b_defaultServergroup: {
			title: "Servergruppe die der Nuzer beim ersten mal connecten bekommt",
			type: "number"
		},
		c_connect: {
			title: "Anzahl wie oft der Client connecten muss um die neue Servergruppe zu bekommen",
			type: "number"
		} 
	}

}, function(sinusbot, config){
	sinusbot.log("Neue Clients Script geladen");

	sinusbot.on("clientMove", function(ev){
		if (ev.oldChannel == 0) {
			for (var i = ev.clientServerGroups.length - 1; i >= 0; i--) {
				if (ev.clientServerGroups[i]["i"] == config.b_defaultServergroup) {
					sinusbot.log("Client " + ev.clientNick + " ist neu hier");

					//Wenn für den Client noch keine variable gesetzt wurde wird sie gesetzt, falls sie schon existiert wird sie um 1 erhöht

					if (sinusbot.getVarInstance(ev.clientUid) == undefined) {
						sinusbot.setVarInstance(ev.clientUid, 1);
						sinusbot.log("Client " + ev.clientNick + " ist zum ersten mal da, Variable neu gesetzt");
					} else if (sinusbot.getVarInstance(ev.clientUid) != undefined) {
						sinusbot.setVarInstance(ev.clientUid, sinusbot.getVarInstance(ev.clientUid) + 1);
						sinusbot.log("Client " + ev.clientNick + " war zum " + sinusbot.getVarInstance(ev.clientUid) + " mal da");
					}

					//Wenn der Client bereits so oft wie in der Config angegeben connected ist, wird ihm die neue Servergruppe gegeben

					if (sinusbot.getVarInstance(ev.clientUid) >= config.c_connect) {
						sinusbot.addClientToServerGroup(ev.client.dbid, config.a_newServergroup);
						sinusbot.log("Dem Client " + ev.clientNick + " die neue Servergruppe gegeben");
						sinusbot.unsetVarInstance(ev.clientUid);
						sinusbot.log("Variable von " + ev.clientNick + " vernichtet");
					}

				} else if (ev.clientServerGroups[i]["i"] == config.a_newServergroup) {
					sinusbot.log("Client " + ev.clientNick + " ist schon ein User");
				} else {
					sinusbot.log("Client " + ev.clientNick + " ist keines von beidem");
				}
			}
		} else {
			sinusbot.log("Client " + ev.clientNick + " war schon online");
		}
	});
	
});
