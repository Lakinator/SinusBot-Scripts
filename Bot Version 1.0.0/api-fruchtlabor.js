registerPlugin({
    name: 'API Request Script for FruchtLabor',
    version: '1.0',
    description: 'Kümmert sich um sinusbot api requests',
    author: 'Lukas Schalk <https://github.com/Lakinator>',
    requiredModules: [],
    engines: '>= 1.0.0',
    vars: [],
    autorun: false
}, function (sinusbot, config, info) {

    // Info: https://www.sinusbot.com/api/
    // Info: https://sinusbot.github.io/scripting-docs/#eventeventapieventname

    //--------------------------------------------------- {Requires} -----------------------------------------------------------

    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var helpers = require('helpers');

    //--------------------------------------------------- {Defaults} -----------------------------------------------------------

    if (!config) config = {};

    //--------------------------------------------------- {Functions} ----------------------------------------------------------

    //--------------------------------------------------- {function event load} ------------------------------------------------

    event.on('load', () => {
        engine.log('FruchtLabor API Script loaded successfully.');
    });

    //--------------------------------------------------- {API add/remove server group} -----------------------------------------------
    // Info: POST request
    // Info: authentication required (login first and the use 'bearer <token>' as auth header)
    // Info: json body -> {"uid": "abcdefghijklmopq=","serverGroupId": 1337}

    event.on('api:addServerGroup', ev => {
        let client = backend.getClientByUniqueID(ev.data().uid);

        if (!client) {
            return { success: false, reason: "client not found" };
        }

        let added = client.addToServerGroup(ev.data().serverGroupId);

        if (!added) {
            return { success: false, reason: "could not add client to servergroup" };
        }

        return { success: true };
    });

    event.on('api:removeServerGroup', ev => {
        let client = backend.getClientByUniqueID(ev.data().uid);

        if (!client) {
            return { success: false, reason: "client not found" };
        }

        let removed = client.removeFromServerGroup(ev.data().serverGroupId);

        if (!removed) {
            return { success: false, reason: "could not remove client from servergroup" };
        }

        return { success: true };
    });

});