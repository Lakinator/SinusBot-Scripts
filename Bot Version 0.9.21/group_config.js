//Plugin erstellt von Laki
//Credit me if you use this Plugin!
registerPlugin({
	name: "Servergruppen Style Config Script",
	version: "1.0",
	description: "Script dass sich um die stylischen Servergruppen Zusätze kümmert",
	author: "Laki <lakinator.bplaced.net>",
	vars: [
		{
			name: "forbidden_servergroups",
			title: "Servergruppen IDs die keinen Zugriff auf Styles haben",
			type: "array",
			vars: [
	          	{
	            	name: "id",
	            	title: "ID der Verbotenen Gruppe",
	            	type: "number"
	          	}
          	]
		},
		{
			name: "style_servergroups",
			title: "Servergruppen Style Objekte",
			type: "array",
			vars: [
	          	{
	            	name: "id_start",
	            	title: "ID der Start Style Gruppe",
	            	type: "number"
	          	},
	          	{
	            	name: "id_end",
	            	title: "ID der Ende Style Gruppe",
	            	type: "number"
	          	},
	          	{
					name: "groups",
	            	title: "IDs der beinhalteten Gruppen",
	            	type: "array",
	            	vars: [
	            		{
	            			name: "id",
	            			title: "ID einer beinhalteten Gruppe",
	            			type: "number"
	          			}
	            	]
				},
	          	{
	          		name: "extra_groups",
	            	title: "Extra Style Gruppen Objekte (wenn keine dann freilassen)",
	            	type: "array",
	            	vars: [
	            		{
	            			name: "id_extra",
	            			title: "ID der Extra Style Gruppe",
	            			type: "number"
	            		},
	            		{
	            			name: "extra_group_ids",
	            			title: "IDs der beinhalteten Extra Style Gruppen",
	            			type: "array",
	            			vars: [
	            				{
	            					name: "id",
	            					title: "ID einer beinhalteten Extra Gruppe",
	            					type: "number"
	            				}
	            			]
	            		}
	            	]
	          	}
          	]
		}
	]
}, function(sinusbot, config){

	var engine = require("engine");
  	var backend = require("backend");
  	var event = require("event");

  	var forbidden_ids = [];
  	for (var i = 0; i < config.forbidden_servergroups.length; i++) {
  		forbidden_ids[i] = config.forbidden_servergroups[i].id;
  	}

  	var groupStyleObjects = [];
  	for (var i = 0; i < config.style_servergroups.length; i++) {
  		groupStyleObjects[i] = new groupStyleObject(i);
  	}


  	event.on("clientVisible", function(ev) {
  		if (ev.fromChannel == null && !hasGroups(ev.client, forbidden_ids)) {

  			for (var i = 0; i < groupStyleObjects.length; i++) {
  			//Normal
  			if (hasGroups(ev.client, groupStyleObjects[i].groups)) {
  				if (!hasGroup(ev.client, groupStyleObjects[i].id_start)) {
  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_start).name() + " hinzugefügt");
  					ev.client.addToServerGroup("" + groupStyleObjects[i].id_start);
  				}
  				if (!hasGroup(ev.client, groupStyleObjects[i].id_end)) {
  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_end).name() + " hinzugefügt");
  					ev.client.addToServerGroup("" + groupStyleObjects[i].id_end);
  				}
  			} else {
  				if (hasGroup(ev.client, groupStyleObjects[i].id_start)) {
  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_start).name() + " entfernt");
  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].id_start);
  				}
  				if (hasGroup(ev.client, groupStyleObjects[i].id_end)) {
  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_end).name() + " entfernt");
  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].id_end);
  				}
  			}

  			//Extra
  			if (groupStyleObjects[i].groupExtras.length > 0) {
	  			for (var j = 0; j < groupStyleObjects[i].groupExtras.length; j++) {
	  					
		  			if (hasGroups(ev.client, groupStyleObjects[i].groupExtras[j].extra_group_ids)) {
		  				if (!hasGroup(ev.client, groupStyleObjects[i].groupExtras[j].id_extra)) {
		  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].groupExtras[j].id_extra).name() + " hinzugefügt");
		  					ev.client.addToServerGroup("" + groupStyleObjects[i].groupExtras[j].id_extra);
		  				}
		  			} else {
		  				if (hasGroup(ev.client, groupStyleObjects[i].groupExtras[j].id_extra)) {
		  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].groupExtras[j].id_extra).name() + " entfernt");
		  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].groupExtras[j].id_extra);
		  				}
		  			}

	  			}
  			}
  		}

		}
  	});

  	event.on("serverGroupAdded", function(ev) {
  		if (!hasGroups(ev.client, forbidden_ids)) {

  			for (var i = 0; i < groupStyleObjects.length; i++) {
  			//Normal
  			if (hasGroups(ev.client, groupStyleObjects[i].groups)) {
  				if (!hasGroup(ev.client, groupStyleObjects[i].id_start)) {
  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_start).name() + " hinzugefügt");
  					ev.client.addToServerGroup("" + groupStyleObjects[i].id_start);
  				}
  				if (!hasGroup(ev.client, groupStyleObjects[i].id_end)) {
  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_end).name() + " hinzugefügt");
  					ev.client.addToServerGroup("" + groupStyleObjects[i].id_end);
  				}
  			}

  			//Extra
  			if (groupStyleObjects[i].groupExtras.length > 0) {
	  			for (var j = 0; j < groupStyleObjects[i].groupExtras.length; j++) {
	  					
		  			if (hasGroups(ev.client, groupStyleObjects[i].groupExtras[j].extra_group_ids)) {
		  				if (!hasGroup(ev.client, groupStyleObjects[i].groupExtras[j].id_extra)) {
		  					engine.log(ev.client.name() + " wird zur Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].groupExtras[j].id_extra).name() + " hinzugefügt");
		  					ev.client.addToServerGroup("" + groupStyleObjects[i].groupExtras[j].id_extra);
		  				}
		  			}

	  			}
  			}
  		}

		}
  	});

  	event.on("serverGroupRemoved", function(ev) {
  		if (!hasGroups(ev.client, forbidden_ids)) {

  			for (var i = 0; i < groupStyleObjects.length; i++) {
  			//Normal
  			if (!hasGroups(ev.client, groupStyleObjects[i].groups)) {
  				if (hasGroup(ev.client, groupStyleObjects[i].id_start)) {
  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_start).name() + " entfernt");
  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].id_start);
  				}
  				if (hasGroup(ev.client, groupStyleObjects[i].id_end)) {
  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].id_end).name() + " entfernt");
  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].id_end);
  				}
  			}

  			//Extra
  			if (groupStyleObjects[i].groupExtras.length > 0) {
	  			for (var j = 0; j < groupStyleObjects[i].groupExtras.length; j++) {
	  					
		  			if (!hasGroups(ev.client, groupStyleObjects[i].groupExtras[j].extra_group_ids)) {
		  				if (hasGroup(ev.client, groupStyleObjects[i].groupExtras[j].id_extra)) {
		  					engine.log(ev.client.name() + " wird von der Servergruppe " + backend.getServerGroupByID(groupStyleObjects[i].groupExtras[j].id_extra).name() + " entfernt");
		  					ev.client.removeFromServerGroup("" + groupStyleObjects[i].groupExtras[j].id_extra);
		  				}
		  			}

	  			}
  			}
  		}

		}
  	});





  	function groupStyleObject(arrayPosition) {
  		//Normal
  		this.id_start = config.style_servergroups[arrayPosition].id_start;
  		this.id_end = config.style_servergroups[arrayPosition].id_end;
  		this.groups = [];
  		for (var i = 0; i < config.style_servergroups[arrayPosition].groups.length; i++) {
  			this.groups[i] = config.style_servergroups[arrayPosition].groups[i].id;
  		}
  		
  		//Extra
  		this.groupExtras = [];
  		if (config.style_servergroups[arrayPosition].extra_groups != undefined) {
  			if (config.style_servergroups[arrayPosition].extra_groups.length > 0) {
		  		for (var i = 0; i < config.style_servergroups[arrayPosition].extra_groups.length; i++) {
		  			this.groupExtras[i] = new groupExtraObject(config.style_servergroups[arrayPosition].extra_groups[i]);
		  		}
  			}
  		}

  	}

  	function groupExtraObject(extraConfigObject) {
  		this.id_extra = extraConfigObject.id_extra;
  		this.extra_group_ids = [];
  		for (var i = 0; i < extraConfigObject.extra_group_ids.length; i++) {
  			this.extra_group_ids[i] = extraConfigObject.extra_group_ids[i].id;
  		}
  	}


  	//Checks if a client has at least one of the given groups
  	function hasGroups(cl /**/) {
  		var args = arguments;

  		for (var i = 0; i < args[1].length; i++) {
  			if (hasGroup(cl, args[1][i])) return true;
  		}

  		return false;
  	}

  	function hasGroup(cl, groupID) {
		var groups = cl.getServerGroups();

		for (var i = 0; i < groups.length; i++) {
			if (groups[i].id() == groupID) return true;
		}

		return false;
	}

});
