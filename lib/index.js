'use strict';

const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');

const Request = require('./request');
const Response = require('./response');
const Symbols = require('./symbols');


const internals = {};


internals.options = Joi.object().keys({
    url: Joi.alternatives([
        Joi.string(),
        Joi.object().keys({
            protocol: Joi.string(),
            hostname: Joi.string(),
            port: Joi.any(),
            pathname: Joi.string().required(),
            query: Joi.any()
        })
    ])
        .required(),
    headers: Joi.object(),
    payload: Joi.any(),
    simulate: {
        end: Joi.boolean(),
        split: Joi.boolean(),
        error: Joi.boolean(),
        close: Joi.boolean()
    },
    authority: Joi.string(),
    remoteAddress: Joi.string(),
    method: Joi.string(),
    validate: Joi.boolean()
});


// /!\ EGREGIOUS HACK /!\
internals.applyPrototypeHack = function (instance, cls) {

    Object.getOwnPropertyNames(cls.prototype).forEach((name) => {

        instance[name] = cls.prototype[name];
    });
};


exports.inject = function (dispatchFunc, options) {

    options = (typeof options === 'string' ? { url: options } : options);

    if (options.validate !== false) {                                                           // Defaults to true
        try {
            Hoek.assert(typeof dispatchFunc === 'function', 'Invalid dispatch function');
            Joi.assert(options, internals.options);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    return new Promise((resolve) => {

        const req = new Request(options);
        const res = new Response(req, resolve);

        internals.applyPrototypeHack(req, Request);
        internals.applyPrototypeHack(res, Response);

        req.prepare(() => dispatchFunc(req, res));
    });
};


exports.isInjection = function (obj) {

    return !!obj[Symbols.injection];
};
