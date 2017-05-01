//SinusBot Version 0.9.15
//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: 'Supporter Online Script',
	version: '1.0',
	description: 'Anzeige von Online Supportern',
	author: 'Laki <lakinator.bplaced.net>',
	vars: {
		d_debug: {
			title: 'Debug aktivieren?',
			type: 'select',
			options: ['Ja', 'Nein'] //Ja = 0, Nein = 1
		},
		c_supporter: {
			title: 'UID der Supporter, durch Komma getrennt und ohne Leerzeichen',
			type: 'string'
		},
		b_sup_channel: {
			title: 'Channel der Supporter (Der dann umbenannt wird)',
			type: 'channel'
		},
		a_channel_name: {
			title: 'Name des Channels mit %n als Platzhalter für die Anzahl',
			type: 'string'
		}
	}
}, function(sinusbot, config){
	sinusbot.log("Supporter Online script geladen");

	var supporter = config.c_supporter.split(",");
	var online = 0;
	var on_alt = 0;
	var ch_name = "";
	var supportNames = "[b][color=green]Supporter[/color][/b] Online:\n";

	for (var i = supporter.length - 1; i >= 0; i--) {
     		isClientOnline(supporter[i]);
    }

    if (online == 0) {
    	supportNames = "Kein [b][color=red]Supporter[/color][/b] Online\n";
    	ch_name = config.a_channel_name.replace(/%n/g, online);
	    channelUpdate(config.b_sup_channel, {name: ch_name, description: supportNames});
    } else if (online > 0) {
	    ch_name = config.a_channel_name.replace(/%n/g, online);
	    channelUpdate(config.b_sup_channel, {name: ch_name, description: supportNames});
	}

    ch_name = config.a_channel_name.replace(/%n/g, online);
	channelUpdate(config.b_sup_channel, {name: ch_name, description: supportNames});
	

	setInterval(function() {
		on_alt = online;
		online = 0;
		ch_name = "";
		supportNames = "[b][color=green]Supporter[/color][/b] Online:\n";

    	for (var i = supporter.length - 1; i >= 0; i--) {
     		isClientOnline(supporter[i]);
    	}

    	if (online == 0 && on_alt != online) {
    		supportNames = "Kein [b][color=red]Supporter[/color][/b] Online\n";
    		ch_name = config.a_channel_name.replace(/%n/g, online);
	        channelUpdate(config.b_sup_channel, {name: ch_name, description: supportNames});
    	} else if (online > 0 && on_alt != online) {
	    	ch_name = config.a_channel_name.replace(/%n/g, online);
	        channelUpdate(config.b_sup_channel, {name: ch_name, description: supportNames});
	    }

    	if (config.d_debug == 0) sinusbot.log("Supporter Online: " + online);
    }, 2000);

	function isClientOnline(UID) {
        var channels = getChannels();
        var isOnline = false;
        for (var i = channels.length - 1; i >= 0; i--) {
        	for (var f = channels[i]["clients"].length - 1; f >= 0; f--) {
        		if (channels[i]["clients"][f].uid == UID) {
        			if (config.d_debug == 0) sinusbot.log("Gesuchter Client " + channels[i]["clients"][f].nick + " ist Online | In Channel: " + channels[i].name);
        			isOnline = true;
        			online++;
        			supportNames += "Der Supporter " + "[URL=client://0/"+ channels[i]["clients"][f].uid +"~" + channels[i]["clients"][f].nick.replace(/ /g, "%") + "]" + channels[i]["clients"][f].nick +"[/URL]" + " ist online\n";
        		}
        	}
        }
        if (!isOnline && config.d_debug == 0) sinusbot.log("Gesuchter Client ist offline");
    }
});
