/*jshint loopfunc: true */
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
            BrowseNode: node,
            Availability: 'Available',
            Sort: 'reviewrank'
        }, function(err, result) {
            // if we didn't get a price searchbin, preset the user with the currect results and the option to refine the search
            // console.log(result.Items);
            var sets, nodes, items;
            items = result.Items.Item;
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
                // otherwise, all we care about is price
                } else if (sets[i]['@'].NarrowBy === 'PriceRange') {
                    // create a new search with each price range as parameters
                    var p;
                    items = [];
                    for (var j = 0; j < sets[i].Bin.length; j++) {
                        // sets[i].Bin[j]
                        p = sets[i].Bin[j].BinParameter;
                        var options = {
                            SearchIndex: index,
                            Keywords: query,
                            BrowseNode: node,
                            Availability: 'Available',
                            Sort: 'reviewrank'
                        };
                        if (!(p instanceof Array)) {
                            p = [p];
                        }

                        for (var k = 0; k < p.length; k++) {
                            options[p[k].Name] = p[k].Value;
                        }
                        prodAdv.call("ItemSearch", options, function(err, result) {
                            console.log(p, result);
                            items.push(result.Items.Item);
                        });
                    }
                }
            }

            res.json({
                results: items,
                narrowNodes: nodes,
                sets: sets
            });
        }
    );

};