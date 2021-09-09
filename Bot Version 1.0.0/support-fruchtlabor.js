registerPlugin({
    name: 'Support Script for FruchtLabor',
    version: '1.0',
    description: 'Heavy modification of Support++ <https://forum.sinusbot.com/resources/support.229/>',
    author: 'Lukas Schalk <https://github.com/Lakinator>',
    requiredModules: [],
    engines: '>= 1.0.0',
    vars: [
        {
            name: 'spSupportUserNoMessage',
            title:
                'Response sent to the user if no supporter is online [Variable &u = Username] (*)',
            placeholder: 'Sorry &u, there is no supporter online right now!',
            default: 'Sorry &u, there is no supporter online right now!',
            type: 'string',
        },
        {
            name: 'spSupportUserAFKMessage',
            title:
                'Response sent to the user if supporters are online, but currently AFK [Variable &u = Username | &spI = Online supporter count (int) | &spN = Online supporter names (list)] (*)',
            placeholder: 'Sorry &u, there are &spI supporters online right now, but they are AFK, check back later to see if they (&spN) are back.',
            default: 'Sorry &u, there are &spI supporters online right now, but they are AFK, check back later to see if they (&spN) are back.',
            type: 'string',
        },
        {
            name: 'spSupportUserIgnoreMessage',
            title: 'Message sent to ignored users [Variable &u = Username] (*)',
            placeholder: 'Sorry &u but you are on the ignore list.',
            default: 'Sorry &u but you are on the ignore list.',
            type: 'string',
        },
        {
            name: 'spMsgMode_user',
            title: 'Notification mode for users (*)',
            type: 'select',
            options: ['Poke', 'Chat'],
            default: '0',
        },
        {
            name: 'spMsgMode_sp',
            title: 'Notification mode for supporters (*)',
            type: 'select',
            options: ['Poke', 'Chat'],
            default: '0',
        },
        {
            name: 'spSupportChannels',
            indent: 2,
            title: 'Support Channels (*)',
            type: 'array',
            vars: [
                {
                    name: 'spSupportChannel',
                    indent: 1,
                    title:
                        'Select the support channel that users will enter when they need support (*)',
                    type: 'channel',
                },
                {
                    name: 'spSupporterId',
                    indent: 1,
                    title: 'Supporter servergroup ID (*)',
                    type: 'strings',
                },
                {
                    name: 'spSupportUserMessage',
                    indent: 1,
                    title:
                        'Message sent to the user when he joins the support channel [Variable &u = Username | &spI = Online supporter count (int) | &spA = AFK supporter count (int) | &spN = Informed supporters (list)] (*)',
                    placeholder:
                        'Hello &u, please wait, these supporters have been notified: &spN. Supporters online: &spI. AFK supporters online: &spA.',
                    default:
                        'Hello &u, please wait, these supporters have been notified: &spN. Supporters online: &spI. AFK supporters online: &spA.',
                    type: 'string',
                },
                {
                    name: 'spSupportMessage',
                    indent: 1,
                    title:
                        'Message sent to the supporter if a user requested help [Variable &u = Username | &spI = Other notified supporters (int)] (*)',
                    placeholder: 'User &u needs support! &spI other supporters were notified.',
                    default: 'User &u needs support! &spI other supporters were notified.',
                    type: 'string',
                },
            ],
        },
        {
            name: 'spIgnoreId',
            indent: 2,
            title: 'Ignore servergroup ID, clients with at least one of these groups are not triggering/receiving support messages (*)',
            type: 'strings',
        },
        {
            name: 'spAfkChannels',
            indent: 2,
            title: 'AFK Channels - ignore Supporter... (*)',
            type: 'array',
            vars: [
                {
                    name: 'spAfkChannel',
                    title: 'AFK Channel ignore Supporters. (*)',
                    type: 'channel',
                },
            ],
        },

        //------------------------------------------------------------------- {Module Config} ---------------------------------------------------------------------------------
        {
            name: 'spModule',
            title: 'Support module. Activate the module with the Checkbox.',
        },

        //                        -> AntiFlood

        {
            name: 'spAntiFloodActiv',
            indent: 2,
            title: '[AntiFlood] AntiFlood Protection',
            type: 'checkbox',
        },
        {
            name: 'spAntiFloodInfo',
            indent: 4,
            title:
                'This module will protect your support bot against flood. (WARNING: This module uses the internal storage.)',
            conditions: [
                {
                    field: 'spAntiFloodActiv',
                    value: true,
                },
            ],
        },
        {
            name: 'spAntiFloodPointsReduce',
            indent: 4,
            title: 'Reduce points per minute (*)',
            placeholder: '5',
            default: 5,
            type: 'number',
            conditions: [
                {
                    field: 'spAntiFloodActiv',
                    value: true,
                },
            ],
        },
        {
            name: 'spAntiFloodPointsLimit',
            indent: 4,
            title: 'Points to lock the user (*)',
            placeholder: '60',
            default: 60,
            type: 'number',
            conditions: [
                {
                    field: 'spAntiFloodActiv',
                    value: true,
                },
            ],
        },
        {
            name: 'spAntiFloodPointsSupport',
            indent: 4,
            title: 'Points for each support request (*)',
            placeholder: '20',
            default: 20,
            type: 'number',
            conditions: [
                {
                    field: 'spAntiFloodActiv',
                    value: true,
                },
            ],
        },
        {
            name: 'spAntiFloodBlockedMessage',
            indent: 4,
            title: 'Message the user receives when he is flooding the bot (*)',
            placeholder: '[color=#aa0000][b]This action is currently not possible because of spam protection. Try again in a few minutes.[/b][/color]',
            default: '[color=#aa0000][b]This action is currently not possible because of spam protection. Try again in a few minutes.[/b][/color]',
            type: 'string',
            conditions: [
                {
                    field: 'spAntiFloodActiv',
                    value: true,
                },
            ],
        },

        //                         AntiFlood <-
        //                        -> Prefix

        {
            name: 'spPrefixActiv',
            indent: 2,
            title: '[Prefix] Change the default prefix (e.g. Support |)',
            type: 'checkbox',
        },
        {
            name: 'spPrefixSupport',
            indent: 4,
            title: 'Change the support prefix',
            placeholder: '[B]Support | [/B]',
            default: '[B]Support | [/B]',
            type: 'string',
            conditions: [
                {
                    field: 'spPrefixActiv',
                    value: true,
                },
            ],
        },

        //                         Prefix <-
    ],
    autorun: false
}, function (sinusbot, config, info) {

    //--------------------------------------------------- {Requires} -----------------------------------------------------------

    var event = require('event');
    var engine = require('engine');
    var backend = require('backend');
    var store = require('store');
    var helpers = require('helpers');

    //--------------------------------------------------- {Defaults} -----------------------------------------------------------

    if (!config) config = {};

    var n_sp = 0;
    var n_user = 1;

    if (typeof config.spMsgMode_sp != 'undefined') {
        n_sp = config.spMsgMode_sp;
    }

    if (typeof config.spMsgMode_user != 'undefined') {
        n_user = config.spMsgMode_user;
    }

    //--------------------------------------------------- {Prefix} -----------------------------------------------------------

    var prefixSupport;

    if (config.spPrefixActiv) {
        if (typeof config.spPrefixSupport == 'undefined') {
            prefixSupport = '[B]Support | [/B]';
        } else {
            prefixSupport = config.spPrefixSupport + ' ';
        }
    } else {
        prefixSupport = '[B]Support | [/B]';
    }

    //--------------------------------------------------- {Functions} -----------------------------------------------------------

    // Get suppporter client ids
    function getSupporters(groupArray = [], afk = false) {
        let supporters = [];
        let i = -1;

        if (groupArray.length == 0) {
            config.spSupportChannels.forEach(function (spg) {
                backend.getClients().forEach(function (client) {
                    client.getServerGroups().forEach(function (group) {
                        spg.spSupporterId.forEach(function (group2) {
                            if ((!isAFK(client.getChannels()[0].id()) && !afk) || (isAFK(client.getChannels()[0].id()) && afk)) {
                                if (group.id() == group2) {
                                    i = i + 1;
                                    supporters[i] = client.id();
                                }
                            }
                        });
                    });
                });
            });
        } else {
            backend.getClients().forEach(function (client) {
                client.getServerGroups().forEach(function (group) {
                    groupArray.forEach(function (group2) {
                        if ((!isAFK(client.getChannels()[0].id()) && !afk) || (isAFK(client.getChannels()[0].id()) && afk)) {
                            if (group.id() == group2) {
                                i = i + 1;
                                supporters[i] = client.id();
                            }
                        }
                    });
                });
            });
        }

        return uniq(supporters);
    }

    // Get names of specified supporters
    function getSupporterNames(supporters) {
        let supNames = [];

        supporters.forEach((sp) => {
            supNames.push(backend.getClientByID(sp).name());
        });

        return supNames;
    }

    // Check Ignore User
    function isIgnore(client_id) {
        let ignore = false;
        backend
            .getClientByID(client_id)
            .getServerGroups()
            .forEach(function (group) {
                config.spIgnoreId.forEach(function (group2) {
                    if (group.id() == group2) {
                        ignore = true;
                    }
                });
            });
        return ignore;
    }

    // AFK Channel?
    function isAFK(channel_id) {
        let afkChannels = config.spAfkChannels;
        if (afkChannels != undefined) {
            for (let i = 0; i < afkChannels.length; i++) {
                if (afkChannels[i].spAfkChannel == channel_id) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if client is supporter
    function isClientSupporter(clientId, groupArray = []) {
        let is = false;

        if (groupArray.length == 0) {
            config.spSupportChannels.forEach(function (spg) {
                backend
                    .getClientByID(clientId)
                    .getServerGroups()
                    .forEach(function (group) {
                        spg.spSupporterId.forEach(function (group2) {
                            if (group.id() == group2) {
                                is = true;
                            }
                        });
                    });
            });
        } else {
            backend
                .getClientByID(clientId)
                .getServerGroups()
                .forEach(function (group) {
                    groupArray.forEach(function (group2) {
                        if (group.id() == group2) {
                            is = true;
                        }
                    });
                });
        }

        return is;
    }

    // Returns unique array
    function uniq(a) {
        return Array.from(new Set(a));
    }

    //--------------------------------------------------- {AntiFlood} -----------------------------------------------------------

    function AntiFlood(clientId, points) {
        if (config.spAntiFloodActiv) {
            const uid = backend.getClientByID(clientId).uid();
            const ds = store.get(uid);

            store.set(uid, ds + points);
        } else {
            return false;
        }
    }

    function isFlood(clientId, points) {
        const uid = backend.getClientByID(clientId).uid();
        const client = backend.getClientByID(clientId);
        const ds = store.get(uid);

        //engine.log('FloodInfo: ' + client.name() + ' - ' + ds + ' of max ' + config.spAntiFloodPointsLimit);

        if (ds >= config.spAntiFloodPointsLimit) {
            client.chat(config.spAntiFloodBlockedMessage);
            AntiFlood(clientId, 0);
            return true;
        } else {
            AntiFlood(clientId, points);
            return false;
        }
    }

    setInterval(function () {
        store.getKeys().forEach(function (key) {
            const ds = store.get(key);
            if (ds <= 0) {
                store.unset(key);
            } else {
                store.set(key, ds - config.spAntiFloodPointsReduce);
            }
        });
    }, 60000);

    //--------------------------------------------------- {function event load} -----------------------------------------------------------

    event.on('load', () => {
        engine.log('FruchtLabor Supportscript loaded successfully');
    });

    //--------------------------------------------------- {function event connect} -----------------------------------------------------------

    event.on('connect', () => {
        setTimeout(function () {
            engine.log('Availabe supporters online: ' + getSupporters().length + ' -> ' + getSupporterNames(getSupporters()).join(', '));
            engine.log('AFK supporters online: ' + getSupporters([], true).length + ' -> ' + getSupporterNames(getSupporters([], true)).join(', '));
        }, 1000);
    });

    //--------------------------------------------------- {function event clientMove} -----------------------------------------------------------

    //MoveEvent -> User joint Support Channel
    event.on('clientMove', function (ev) {
        if (!backend.isConnected()) return;
        if (ev.client.isSelf()) return;
        if (typeof ev.toChannel == 'undefined') return;

        //Send Message (Supporter)
        function sendMessage(client, message, type) {
            const msg = prefixSupport + message.replace('&u', ev.client.name());

            //engine.log(client.name() + ' -> ' + msg);

            if (type == 'sp') {
                // Check if supporter is on ignore list
                if (!isIgnore(client.id())) {
                    if (n_sp == 0) {
                        client.poke(msg);
                    } else {
                        client.chat(msg);
                    }
                }
            } else {
                if (n_user == 0) {
                    client.poke(msg);
                } else {
                    client.chat(msg);
                }
            }
        }

        //--------------------------------------------------- {Join Support Channel} -----------------------------------------------------------

        let channel;

        // Check is join support channel
        config.spSupportChannels.forEach(function (sp) {
            channel = ev.client.getChannels();

            if (channel[0].id() == sp.spSupportChannel) {

                // Check if user is supporter
                if (isClientSupporter(ev.client.id(), sp.spSupporterId)) {
                    // Ignore
                } else {
                    // Check is user on ignore list?
                    if (isFlood(ev.client.id(), config.spAntiFloodPointsSupport)) {
                    } else {
                        if (isIgnore(ev.client.id())) {
                            sendMessage(
                                ev.client,
                                config.spSupportUserIgnoreMessage,
                                'user'
                            );
                        } else {
                            // Check supporter Online?
                            if (!(getSupporters(sp.spSupporterId).length > 0)) {
                                // Check afk supporter online?
                                const afkSupporters = getSupporters(sp.spSupporterId, true);
                                if (afkSupporters > 0) {
                                    sendMessage(
                                        ev.client,
                                        config.spSupportUserAFKMessage.replace('&spI', afkSupporters.length).replace('&spN', getSupporterNames(afkSupporters).join(', ')),
                                        'user');
                                } else {
                                    sendMessage(
                                        ev.client,
                                        config.spSupportUserNoMessage,
                                        'user');
                                }
                            } else {
                                // Supporter is online!
                                const onlineSupporters = getSupporters(sp.spSupporterId);

                                onlineSupporters.forEach(function (onlineSupporterID) {
                                    // Notify supporter
                                    setTimeout(function () {
                                        sendMessage(
                                            backend.getClientByID(onlineSupporterID),
                                            sp.spSupportMessage.replace('&spI', onlineSupporters.length - 1),
                                            'sp'
                                        );
                                    }, 10);
                                });
                                // Send User Message
                                sendMessage(
                                    ev.client,
                                    sp.spSupportUserMessage.replace('&spI', onlineSupporters.length).replace('&spN', getSupporterNames(onlineSupporters).join(', ')).replace('&spA', getSupporters(sp.spSupporterId, true).length),
                                    'user'
                                );
                            }
                        }
                    }
                }

            }

        });

    });

});