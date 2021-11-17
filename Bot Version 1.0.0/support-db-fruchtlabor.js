registerPlugin({
    name: 'Support DB Script for FruchtLabor',
    version: '1.0',
    description: 'Live Update der angegebenen Datenbank welche Clients in den spezifizierten Channeln sind',
    author: 'Lukas Schalk <https://github.com/Lakinator>',
    requiredModules: ['db'],
    engines: '>= 1.0.0',
    vars: [
        {
            name: 'dbDriver',
            title: 'Datenbanksystem (*)',
            type: 'select',
            options: ['mysql'],
            default: '0',
        },
        {
            name: 'dbHost',
            title: 'Host (*)',
            placeholder: '127.0.0.1',
            type: 'string',
        },
        {
            name: 'dbUsername',
            title: 'Username (*)',
            placeholder: 'username',
            type: 'string',
        },
        {
            name: 'dbPassword',
            title: 'Passwort (*)',
            type: 'password',
        },
        {
            name: 'dbDatabase',
            title: 'Datenbank (*)',
            placeholder: 'fruchtbank',
            type: 'string',
        },
        {
            name: 'dbTable',
            title: 'Tabelle (*)',
            placeholder: 'fruchtsupport',
            default: 'fruchtsupport',
            type: 'string',
        },
        {
            name: 'dbSupportChannels',
            indent: 1,
            title: 'Support Channels (*)',
            type: 'array',
            vars: [
                {
                    name: 'dbSupportChannel',
                    indent: 1,
                    title: 'Support Channel (*)',
                    type: 'channel',
                },
            ],
        },
        {
            name: 'dbIgnoreIds',
            title: 'Servergruppen IDs die ignoriert werden sollen wenn sie in einen Support Channel joinen',
            type: 'strings',
        },
    ],
    autorun: false
}, function (sinusbot, config, info) {

    //--------------------------------------------------- {Requires} -----------------------------------------------------------

    var db = require('db');

    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var helpers = require('helpers');

    //--------------------------------------------------- {Defaults} -----------------------------------------------------------

    if (!config) config = {};

    if (config.dbIgnoreIds == undefined) config.dbIgnoreIds = [];

    let drivers = ["mysql"];
    config.dbDriver = drivers[config.dbDriver];

    let dbc;
    let table = config.dbTable;

    //--------------------------------------------------- {Functions} -----------------------------------------------------------

    // Check Ignore User
    function isIgnore(client_id) {
        let ignore = false;
        backend
            .getClientByID(client_id)
            .getServerGroups()
            .forEach(function (group) {
                config.dbIgnoreIds.forEach(function (group2) {
                    if (group.id() == group2) {
                        ignore = true;
                    }
                });
            });
        return ignore;
    }

    function isSupportChannel(channel_id) {
        let support = false;
        config.dbSupportChannels.forEach(function (dbSupportChannelEntry) {
            if (channel_id == dbSupportChannelEntry.dbSupportChannel) {
                support = true;
            }
        });

        return support;
    }

    function encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }

    function decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    //--------------------------------------------------- {function event load} -----------------------------------------------------------

    event.on('load', () => {
        engine.log('FruchtLabor DB Supportscript loaded successfully');

        dbc = db.connect({ driver: config.dbDriver, host: config.dbHost, username: config.dbUsername, password: config.dbPassword, database: config.dbDatabase }, function (err) {
            if (!err) {
                engine.log("Connected to database " + config.dbDatabase);
            } else {
                engine.log(err);
            }
        });

        /*
        CREATE TABLE IF NOT EXISTS %table%
        (
            UID varchar(255) NOT NULL,
            name varchar(255),
            channel_id int,
            channel_name varchar(255),
            PRIMARY KEY (UID)
        );
        */

        if (dbc) dbc.query("CREATE TABLE IF NOT EXISTS " + table + " (UID varchar(255) NOT NULL, name varchar(255), channel_id int, channel_name varchar(255), PRIMARY KEY (UID))", function (err, res) {
            if (err) {
                engine.log(err);
            }
        });
    });

    //--------------------------------------------------- {function event connect} -----------------------------------------------------------

    event.on('connect', () => {

    });

    //--------------------------------------------------- {function event clientMove} -----------------------------------------------------------

    event.on('clientMove', function (ev) {
        if (!backend.isConnected()) return;
        if (ev.client.isSelf()) return;

        let fromChannel = ev.fromChannel;
        let toChannel = ev.toChannel;

        if (toChannel != undefined && fromChannel != undefined) {
            if (isIgnore(ev.client.id())) return;
        }

        //--------------------------------------------------- {Join Support Channel} -----------------------------------------------------------

        if (fromChannel == undefined) {
            // client connected

            if (isSupportChannel(toChannel.id())) {
                // save to db
                if (dbc) dbc.exec("INSERT INTO " + table + " (UID, name, channel_id, channel_name) VALUES (?, ?, ?, ?);", ev.client.uid(), encode_utf8(ev.client.name()), toChannel.id(), encode_utf8(toChannel.name()));
            }

        } else if (toChannel == undefined) {
            // client disconnected

            if (isSupportChannel(fromChannel.id())) {
                // remove from db
                if (dbc) dbc.exec("DELETE FROM " + table + " WHERE UID = ?;", ev.client.uid());
            }

        } else if (fromChannel != undefined && toChannel != undefined) {
            // client moved between channels

            if (isSupportChannel(fromChannel.id()) && isSupportChannel(toChannel.id())) {
                // moved between support channels -> update sql data
                if (dbc) dbc.exec("UPDATE " + table + " SET channel_id = ?, channel_name = ? WHERE UID = ?;", toChannel.id(), encode_utf8(toChannel.name()), ev.client.uid());
            } else if (isSupportChannel(fromChannel.id())) {
                // moved out of support channel -> remove from db
                if (dbc) dbc.exec("DELETE FROM " + table + " WHERE UID = ?;", ev.client.uid());
            } else if (isSupportChannel(toChannel.id())) {
                // moved to support channel -> save to db
                if (dbc) dbc.exec("INSERT INTO " + table + " (UID, name, channel_id, channel_name) VALUES (?, ?, ?, ?);", ev.client.uid(), encode_utf8(ev.client.name()), toChannel.id(), encode_utf8(toChannel.name()));
            }

        } else {
            engine.log("unknown channel movement");
        }

    });

});