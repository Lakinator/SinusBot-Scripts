//SinusBot Version 0.9.15
//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Teammitglieder Online Script',
	version: '1.0',
	description: 'Anzeige von Online Teammitgliedern',
	author: 'Laki <lakinator.bplaced.net>',
	vars: {
		x_debug: {
			title: 'Debug aktivieren?',
			type: 'select',
			options: ['Ja', 'Nein'] //Ja = 0, Nein = 1
		},
		f_developer: {
			title: 'UIDs der Developer, durch Komma getrennt und ohne Leerzeichen',
			type: 'string'
		},
		e_supporter: {
			title: 'UIDs der Supporter, durch Komma getrennt und ohne Leerzeichen',
			type: 'string'
		},
		d_mods: {
			title: 'UIDs der Moderatoren, durch Komma getrennt und ohne Leerzeichen',
			type: 'string'
		},
		c_admins: {
			title: 'UIDs der Server Admins, durch Komma getrennt und ohne Leerzeichen',
			type: 'string'
		},
		b_team_channel: {
			title: 'Channel der Teammitglieder (Der dann umbenannt wird)',
			type: 'channel'
		},
		a_channel_name: {
			title: 'Name des Channels mit %n als Platzhalter für die Anzahl',
			type: 'string'
		}
	}
}, function(sinusbot, config){
	sinusbot.log("Teammitglieder Online script geladen");

	var admins = config.c_admins != null ? config.c_admins.split(",") : "";
	var mods = config.d_mods != null ? config.d_mods.split(",") : "";
	var supporter = config.e_supporter != null ? config.e_supporter.split(",") : "";
	var developer = config.f_developer != null ? config.f_developer.split(",") : "";
	var admins_online = 0;
	var mods_online = 0;
	var supporter_online = 0;
	var developer_online = 0;
	var admins_online_alt = 0;
	var mods_online_alt = 0;
	var supporter_online_alt = 0;
	var developer_online_alt = 0;
	var ch_name = "";
	var adminNames = "[b][color=green]Admins[/color][/b] Online:\n";
	var modNames = "[b][color=green]Moderatoren[/color][/b] Online:\n";
	var supportNames = "[b][color=green]Supporter[/color][/b] Online:\n";
	var developerNames = "[b][color=green]Developer[/color][/b] Online:\n";
    	
	refreshDesc();

    if (admins_online == 0) adminNames = "Kein [b][color=red]Server Admin[/color][/b] Online\n";
    if (mods_online == 0) modNames = "Kein [b][color=red]Moderator[/color][/b] Online\n";
    if (supporter_online == 0) supportNames = "Kein [b][color=red]Supporter[/color][/b] Online\n";
    if (developer_online == 0) developerNames = "Kein [b][color=red]Developer[/color][/b] Online\n";
    ch_name = config.a_channel_name.replace(/%n/g, admins_online + mods_online + supporter_online + developer_online);
	channelUpdate(config.b_team_channel, {name: ch_name, description: adminNames + "\n" + modNames + "\n" + supportNames + "\n" + developerNames});


	setInterval(function() {
		admins_online_alt = admins_online;
		mods_online_alt = mods_online;
		supporter_online_alt = supporter_online;
		developer_online_alt = developer_online;
		admins_online = 0;
		mods_online = 0;
		supporter_online = 0;
		developer_online = 0;
		ch_name = "";
		adminNames = "[b][color=green]Admins[/color][/b] Online:\n";
		modNames = "[b][color=green]Moderatoren[/color][/b] Online:\n";
		supportNames = "[b][color=green]Supporter[/color][/b] Online:\n";
		developerNames = "[b][color=green]Developer[/color][/b] Online:\n";

		refreshDesc();

    	if (
    		(admins_online >= 0 && admins_online_alt != admins_online) || 
    		(mods_online >= 0 && mods_online_alt != mods_online) || 
    		(supporter_online >= 0 && supporter_online_alt != supporter_online) || 
    		(developer_online >= 0 && developer_online_alt != developer_online)) {

    		if (admins_online == 0) adminNames = "Kein [b][color=red]Server Admin[/color][/b] Online\n";
    		if (mods_online == 0) modNames = "Kein [b][color=red]Moderator[/color][/b] Online\n";
    		if (supporter_online == 0) supportNames = "Kein [b][color=red]Supporter[/color][/b] Online\n";
    		if (developer_online == 0) developerNames = "Kein [b][color=red]Developer[/color][/b] Online\n";
    		ch_name = config.a_channel_name.replace(/%n/g, admins_online + mods_online + supporter_online + developer_online);
	        channelUpdate(config.b_team_channel, {name: ch_name, description: adminNames + "\n" + modNames + "\n" + supportNames + "\n" + developerNames});
    	}

    }, 2000);

	function isClientOnline(UID) {
        var channels = getChannels();
        var isOnline = false;
        for (var i = channels.length - 1; i >= 0; i--) {
        	for (var f = channels[i]["clients"].length - 1; f >= 0; f--) {
        		if (channels[i]["clients"][f].uid == UID) {
        			if (config.x_debug == 0) sinusbot.log("Gesuchter Client " + channels[i]["clients"][f].nick + " ist Online | In Channel: " + channels[i].name);
        			isOnline = true;
        			if (contains(admins, UID) || UID == admins) {
        				adminNames += "Der Server Admin " + "[URL=client://0/"+ channels[i]["clients"][f].uid +"~" + channels[i]["clients"][f].nick.replace(/ /g, "%") + "]" + channels[i]["clients"][f].nick +"[/URL]" + " ist online\n";
        				admins_online++;
        				if (config.x_debug == 0) sinusbot.log("Admin online ++");
        			} else if (contains(mods, UID) || UID == mods) {
        				modNames += "Der Moderator " + "[URL=client://0/"+ channels[i]["clients"][f].uid +"~" + channels[i]["clients"][f].nick.replace(/ /g, "%") + "]" + channels[i]["clients"][f].nick +"[/URL]" + " ist online\n";
        				mods_online++;
        				if (config.x_debug == 0) sinusbot.log("Mod online ++");
        			} else if (contains(supporter, UID) || UID == supporter) {
        				supportNames += "Der Supporter " + "[URL=client://0/"+ channels[i]["clients"][f].uid +"~" + channels[i]["clients"][f].nick.replace(/ /g, "%") + "]" + channels[i]["clients"][f].nick +"[/URL]" + " ist online\n";
        				supporter_online++;
        				if (config.x_debug == 0) sinusbot.log("Sup online ++");
        			} else if (contains(developer, UID) || UID == developer) {
        				developerNames += "Der Developer " + "[URL=client://0/"+ channels[i]["clients"][f].uid +"~" + channels[i]["clients"][f].nick.replace(/ /g, "%") + "]" + channels[i]["clients"][f].nick +"[/URL]" + " ist online\n";
        				developer_online++;
        				if (config.x_debug == 0) sinusbot.log("Dev online ++");
        			}
        		}
        	}
        }
        if (!isOnline && config.x_debug == 0) sinusbot.log("Gesuchter Client ist offline");
    }

    function refreshDesc() {
    	if (admins instanceof Array) {
	    	for (var i = admins.length - 1; i >= 0; i--) {
	     		isClientOnline(admins[i]);
	    	}
	    } else if (admins instanceof String && admins != "") {
	    	isClientOnline(admins);
	    } else if (admins == "") {
	    	if (config.x_debug == 0) sinusbot.log("Admins nicht definiert");
	    }

	    if (mods instanceof Array) {
	    	for (var i = mods.length - 1; i >= 0; i--) {
	     		isClientOnline(mods[i]);
	    	}
	    } else if (mods instanceof String && mods != "") {
	    	isClientOnline(mods);
	    } else if (mods == "") {
	    	if (config.x_debug == 0) sinusbot.log("Moderatoren nicht definiert");
	    }

		if (supporter instanceof Array) {
	    	for (var i = supporter.length - 1; i >= 0; i--) {
	     		isClientOnline(supporter[i]);
	    	}
	    } else if (supporter instanceof String && supporter != "") {
	    	isClientOnline(supporter);
	    } else if (supporter == "") {
	    	if (config.x_debug == 0) sinusbot.log("Supporter nicht definiert");
	    }

	    if (developer instanceof Array) {
	    	for (var i = developer.length - 1; i >= 0; i--) {
	     		isClientOnline(developer[i]);
	    	}
	    } else if (developer instanceof String && developer != "") {
	    	isClientOnline(developer);
	    } else if (developer == "") {
	    	if (config.x_debug == 0) sinusbot.log("Developer nicht definiert");
	    }
    }

    function contains(array, obj) {
    	for (var i = 0; i < array.length; i++) {
        	if (array[i] === obj) {
            	return true;
        	}
    	}
    	return false;
	}
});