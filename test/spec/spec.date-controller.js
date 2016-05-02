'use strict';

var DateController = require('../../');

var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter;

describe('Date Controller', function () {

    beforeEach(function () {
        sinon.spy(EventEmitter.prototype, 'emit');
    });
    afterEach(function () {
        EventEmitter.prototype.emit.restore();
    });

    it('exports a constructor', function () {
        DateController.should.be.a('function');
    });

    it('implements event emitter', function () {
        var form = new DateController({ template: 'index' });
        form.should.be.an.instanceOf(EventEmitter);
    });

    it('has a `process` method', function () {
        var form = new DateController({ template: 'index' });
        form.process.should.be.a('function');
    });

    describe('process', function () {

        var form, handler, req, res, cb, options, key;

        describe('when a field is expected but not required', function () {
            beforeEach(function () {
                key = 'date-field';
                options = { template: 'index', fields: {} };
                options.fields[key] = {}
                form = new DateController(options);
                sinon.stub(form, 'get').yields();
                sinon.stub(form, 'post').yields();
                // use a spy instead of a stub so that the length is unaffected
                sinon.spy(form, 'errorHandler');
                req = request({
                    url: '/test',
                    params: {}
                }),
                res = {
                    send: sinon.stub()
                };
                cb = function callback() {};
            });

            describe('when an input-date is submitted for the field with valid data', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '12';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('processes fields from the input-date mixin into a single field', function () {
                    req.form.values[key].should.eql('1999-12-01');
                });

                it('processes fields from the input-date mixin into a single, formatted field', function () {
                    req.form.values[key + '-formatted'].should.eql('1 December 1999');
                });

                it('applies the \'date-year\' validator to the year component', function () {
                    options.fields[key + '-year'].validate.should.contain['date-year'];
                });

                it('applies the \'date-month\' validator to the month component', function () {
                    options.fields[key + '-month'].validate.should.contain['date-month'];
                });

                it('applies the \'date-day\' validator to the day component', function () {
                    options.fields[key + '-day'].validate.should.contain['date-day'];
                });

                it('does NOT apply the \'required\' validator to the component fields', function () {
                    options.fields[key + '-year'].validate.should.not.contain('required');
                    options.fields[key + '-month'].validate.should.not.contain('required');
                    options.fields[key + '-day'].validate.should.not.contain('required');
                });
            });

            describe('when an input-date is submitted for another, unexpected field', function () {
                var otherKey = 'other-field';

                beforeEach(function () {
                    req.body[otherKey + '-year'] = '1999';
                    req.body[otherKey + '-month'] = '12';
                    req.body[otherKey + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('does NOT process the unexpected field', function () {
                    should.not.exist(req.form.values[otherKey]);
                    should.not.exist(req.form.values[otherKey + '-formatted']);
                    should.not.exist(req.form.values[otherKey + '-year']);
                    should.not.exist(req.form.values[otherKey + '-month']);
                    should.not.exist(req.form.values[otherKey + '-day']);
                });
            });

            describe('when an input-date is submitted for the field with a missing year component', function () {
                beforeEach(function () {
                    req.body[key + '-month'] = '12';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('does NOT process it as an input-date field', function () {
                    req.form.values[key].should.eql('');
                    should.not.exist(req.form.values[key + '-formatted']);
                    should.not.exist(req.form.values[key + '-year']);
                    should.not.exist(req.form.values[key + '-month']);
                    should.not.exist(req.form.values[key + '-day']);
                });
            });

            describe('when an input-date is submitted for the field with a missing month component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('does NOT process it as an input-date field', function () {
                    req.form.values[key].should.eql('');
                    should.not.exist(req.form.values[key + '-formatted']);
                    should.not.exist(req.form.values[key + '-year']);
                    should.not.exist(req.form.values[key + '-month']);
                    should.not.exist(req.form.values[key + '-day']);
                });
            });

            describe('when an input-date is submitted for the field with a missing day component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '12';

                    form._process(req, res, cb);
                });

                it('does NOT process it as an input-date field', function () {
                    req.form.values[key].should.eql('');
                    should.not.exist(req.form.values[key + '-formatted']);
                    should.not.exist(req.form.values[key + '-year']);
                    should.not.exist(req.form.values[key + '-month']);
                    should.not.exist(req.form.values[key + '-day']);
                });
            });

            describe('when an input-date is submitted for the field with an empty year component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '';
                    req.body[key + '-month'] = '12';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('processes to an empty string', function () {
                    req.form.values[key].should.eql('');
                    req.form.values[key + '-formatted'].should.eql('');
                });
            });

            describe('when an input-date is submitted for the field with an empty month component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('processes to an empty string', function () {
                    req.form.values[key].should.eql('');
                    req.form.values[key + '-formatted'].should.eql('');
                });
            });

            describe('when an input-date is submitted for the field with an empty day component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '12';
                    req.body[key + '-day'] = '';

                    form._process(req, res, cb);
                });

                it('processes to an empty string', function () {
                    req.form.values[key].should.eql('');
                    req.form.values[key + '-formatted'].should.eql('');
                });
            });

            describe('when an input-date is submitted for the field with a single-character month component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '2';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('pads the month component to two characters in the combined field', function () {
                    req.form.values[key].should.eql('1999-02-01');
                    req.form.values[key + '-formatted'].should.eql('1 February 1999');
                });
            });

            describe('when an input-date is submitted for the field with a single-character day component', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '02';
                    req.body[key + '-day'] = '1';

                    form._process(req, res, cb);
                });

                it('pads the day component to two characters in the combined field', function () {
                    req.form.values[key].should.eql('1999-02-01');
                    req.form.values[key + '-formatted'].should.eql('1 February 1999');
                });
            });
        });

        describe('when a field is expected and required', function () {
            beforeEach(function () {
                key = 'date-field';
                options = { template: 'index', fields: {} };
                options.fields[key] = { validate: ['required'] }
                form = new DateController(options);
                sinon.stub(form, 'get').yields();
                sinon.stub(form, 'post').yields();
                // use a spy instead of a stub so that the length is unaffected
                sinon.spy(form, 'errorHandler');
                req = request({
                    url: '/test',
                    params: {}
                }),
                res = {
                    send: sinon.stub()
                };
                cb = function callback() {};
            });

            describe('when an input-date is submitted for the field with valid data', function () {
                beforeEach(function () {
                    req.body[key + '-year'] = '1999';
                    req.body[key + '-month'] = '12';
                    req.body[key + '-day'] = '01';

                    form._process(req, res, cb);
                });

                it('applies the \'required\' validator to the component fields', function () {
                    options.fields[key + '-year'].validate.should.contain('required');
                    options.fields[key + '-month'].validate.should.contain('required');
                    options.fields[key + '-day'].validate.should.contain('required');
                });
            });
        });
    });
});
