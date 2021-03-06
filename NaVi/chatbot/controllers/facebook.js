'use strict';
const
    env = require('../helpers/env'),
    facebookHelpers = require('../helpers/facebook');

module.exports = {
    getWebhook: function(req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === env.VALIDATION_TOKEN) {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
        }
        else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    },
    postWebhook: function (req, res) {
        var data = req.body;

        if (data.object == 'page') {
            data.entry.forEach(function(pageEntry) {
                var pageID = pageEntry.id;
                var timeOfEvent = pageEntry.time;

                pageEntry.messaging.forEach(function(messagingEvent) {
                    if (messagingEvent.optin) {
                        facebookHelpers.receivedAuthentication(messagingEvent);
                    }
                    else if (messagingEvent.message) {
                        facebookHelpers.receivedMessage(messagingEvent);
                    }
                    else if (messagingEvent.delivery) {
                        facebookHelpers.receivedDeliveryConfirmation(messagingEvent);
                    }
                    else if (messagingEvent.postback) {
                        facebookHelpers.receivedPostback(messagingEvent);
                    }
                    else if (messagingEvent.read) {
                        facebookHelpers.receivedMessageRead(messagingEvent);
                    }
                    else if (messagingEvent.account_linking) {
                        facebookHelpers.receivedAccountLink(messagingEvent);
                    }
                    else {
                        console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                    }
                });
            });
            res.sendStatus(200);
        }
    },
    getAuthorize: function(req, res) {
        var accountLinkingToken = req.query['account_linking_token'];
        var redirectURI = req.query['redirect_uri'];

        // Authorization Code should be generated per user by the developer. This will
        // be passed to the Account Linking callback.
        var authCode = "1234567890";

        // Redirect users to this URI on successful login
        var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

        res.render('authorize', {
            accountLinkingToken: accountLinkingToken,
            redirectURI: redirectURI,
            redirectURISuccess: redirectURISuccess
        });
    }
};
