'use strict';

var util = require('util');
var _ = require('underscore');
var Parent = require('hmpo-form-wizard').Controller;
var moment = require('moment');

var DateController = function DateController() {
    Parent.apply(this, arguments);
};

util.inherits(DateController, Parent);

var dateFormat = 'YYYY-MM-DD';
var prettyDate = 'D MMMM YYYY';

DateController.prototype.process = function process(req) {
    _.each(this.options.fields, function processEach(v, k) {
        if (
          (undefined !== req.body[k + '-year']) &&
          (undefined !== req.body[k + '-month']) &&
          (undefined !== req.body[k + '-day'])
        ) {
            var childValidators = _.intersection(v.validate, ['required']);

            var processField = function processField(key, validators) {
                this.options.fields[key] = {
                    validate: childValidators.concat(validators),
                    dependent: v.dependent
                };

                var r = this.formatter(key, req.body[key]);
                req.form.values[key] = r;
                return r;
            }.bind(this);

            var processDateField = function processDateField(key, type) {
                return processField(key + '-' + type, ['date-' + type]);
            };

            var pad = function pad(n) {
                return (n.length < 2) ? '0' + n : n;
            };

            var year = processDateField(k, 'year');
            var month = processDateField(k, 'month');
            var day = processDateField(k, 'day');

            var date = (
                (year !== '') &&
                (month !== '') &&
                (day !== '')
            ) ?
                year + '-' + pad(month) + '-' + pad(day) :
                '';

            req.form.values[k] = date;
            req.form.values[k + '-formatted'] = date === '' ?
                '' :
                moment(date, dateFormat).format(prettyDate);
        }
    }.bind(this));

    Parent.prototype.process.apply(this, arguments);
};

DateController.Error = Parent.Error;
DateController.validators = Parent.validators;
DateController.formatters = Parent.formatters;

module.exports = DateController;
