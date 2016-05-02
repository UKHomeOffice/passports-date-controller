var _ = require('underscore'),
    reqres = require('reqres'),
    SessionModel = require('hmpo-model');

module.exports = function (settings) {
    var req = reqres.req(settings);
    req.sessionModel = req.sessionModel || new SessionModel({}, { session: req.session, key: 'test' });
    return req;
};
