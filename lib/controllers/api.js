'use strict';

/**
 * Get awesome things
 */
exports.search = function(req, res) {
    var query = req.query.query;
    var index = req.query.index;
    var aws = require('aws-lib');
    var info = require('../config/info');

    var prodAdv = aws.createProdAdvClient(info.accessKey, info.secretKey, info.trackingID);

    var options = {SearchIndex: index, Keywords: query};

    prodAdv.call("ItemSearch", options, function(err, result) {
        console.log(result);
    });

};