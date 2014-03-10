'use strict';

/**
 * Get awesome things
 */
exports.search = function(req, res) {
    var query = req.query.query;
    var index = req.query.index;
    var node = req.query.node || undefined;
    var aws = require('aws-lib');
    var info = require('../config/info');
    var prodAdv = aws.createProdAdvClient(info.accessKey, info.secretKey, info.trackingID);

    prodAdv.call("ItemSearch", {
            SearchIndex: index,
            Keywords: query,
            ResponseGroup: 'SearchBins',
            BrowseNode: node
        }, function(err, result) {
            // if we didn't get a price searchbin, preset the user with the currect results and the option to refine the search
            // console.log(result.Items);
            var sets, nodes;
            if (result.Items.SearchBinSets !== undefined && result.Items.SearchBinSets.SearchBinSet !== undefined) {
                if (result.Items.SearchBinSets.SearchBinSet instanceof Array) {
                    // is array
                    sets = result.Items.SearchBinSets.SearchBinSet;
                } else {
                    sets = [result.Items.SearchBinSets.SearchBinSet];
                }
            }

            for (var i = 0; i < sets.length; i++) {
                // console.log(sets[i]);
                if (sets[i]['@'].NarrowBy === 'Categories') {
                    // we can narrow it down if they're into that
                    nodes = sets[i].Bin;
                }
            }

            res.json({
                results: result.Items.Item,
                narrowNodes: nodes
            });
        }
    );

};