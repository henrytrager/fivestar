/*jshint loopfunc: true */
'use strict';

function arrayIfNot(obj) {
    if (typeof obj === 'undefined') {
        return obj;
    }

    if (!(obj instanceof Array)) {
        return [obj];
    }
    return obj;
}

var validSort = {
    none: '',
    Appliances: 'relevancerank',
    MobileApps: 'relevancerank',
    ArtsAndCrafts: 'relevancerank',
    Automotive: 'salesrank',
    Baby: 'salesrank',
    Beauty: 'salesrank',
    Books: 'relevancerank',
    WirelessAccessories: 'relevancerank',
    Apparel: 'relevancerank',
    Collectibles: 'relevancerank',
    PCHardware: 'salesrank',
    Electronics: 'salesrank',
    Grocery: 'salesrank',
    HealthPersonalCare: 'salesrank',
    HomeGarden: 'salesrank',
    Industrial: 'salesrank',
    Jewelry: 'salesrank',
    KindleStore: 'relevancerank',
    Kitchen: 'salesrank',
    Magazines: 'relevancerank',
    Miscellaneous: 'salesrank',
    DigitalMusic: 'songtitlerank',
    Music: 'relevancerank',
    MusicalInstruments: 'salesrank',
    OfficeProducts: 'salesrank',
    OutdoorLiving: 'salesrank',
    LawnGarden: 'relevancerank',
    PetSupplies: 'relevancerank',
    Shoes: 'relevancerank',
    Software: 'salesrank',
    SportingGoods: 'relevancerank',
    Tools: 'salesrank',
    Toys: 'salesrank',
    VideoGames: 'salesrank',
    Watches: 'relevancerank'
};

/**
 * Get awesome things
 */
exports.search = function(req, res) {
    var query = req.query.query;
    var index = req.query.index;
    var node = req.query.node || undefined;
    var brand = req.query.brand || undefined;
    var aws = require('aws-lib');
    var info = require('../config/info');
    var prodAdv = aws.createProdAdvClient(info.accessKey, info.secretKey, info.trackingID);

    var ajaxCalls = 1,
        ajaxCallsMax = 0,
        sets = [],
        nodes = [],
        items,
        didGetPriceRange = false,
        origResult;


    function callWithOptions(options) {
        var minPrice = 0,
            maxPrice = 'max';
        if (options.MinimumPrice !== undefined) {
            minPrice = parseInt(options.MinimumPrice, 10);
        }
        if (options.MaximumPrice !== undefined) {
            maxPrice = parseInt(options.MaximumPrice, 10);
        }
        prodAdv.call("ItemSearch", options, function(err, result) {
            // items.push(result);


            var rItems = result.Items !== undefined ? arrayIfNot(result.Items.Item).splice(0, Math.min(8, arrayIfNot(result.Items.Item).length)) : 'SHIT';
            if (rItems !== 'SHIT') {
                rItems.sort(function(a,b){
                    return parseInt(a.SalesRank, 10) - parseInt(b.SalesRank, 10);
                }).splice(0, Math.min(2, rItems.length));
            }


            ajaxCalls += 1;
            items.push({
                minPrice: minPrice,
                maxPrice: maxPrice,
                items: rItems,
                // raw: result
            });

            if (ajaxCalls >= ajaxCallsMax) {
                res.json({
                    results: items.sort(function(a,b){
                        return a.minPrice - b.minPrice;
                    }),
                    narrowNodes: nodes.map(function(n) {
                        return {
                            '@': n['@'],
                            Bin: arrayIfNot(n.Bin)
                        };
                    }),
                    original: origResult
                });
            }
        });
    }



    prodAdv.call("ItemSearch", {
            SearchIndex: index,
            Keywords: query,
            ResponseGroup: 'SearchBins',
            BrowseNode: node,
            Brand: brand,
            Availability: 'Available',
            Sort: validSort[index]
        }, function(err, result) {
            // if we didn't get a price searchbin, preset the user with the currect results and the option to refine the search
            // console.log(result.Items);
            origResult = result;
            items = result.Items.Item;
            if (result.Items.SearchBinSets !== undefined && result.Items.SearchBinSets.SearchBinSet !== undefined) {
                sets = arrayIfNot(result.Items.SearchBinSets.SearchBinSet);
            }

            for (var i = 0; i < sets.length; i++) {
                // console.log(sets[i]);
                if (['Categories', 'BrandName', 'Subject'].indexOf(sets[i]['@'].NarrowBy) !== -1) {
                    // we can narrow it down if they're into that
                    nodes.push(sets[i]);
                // otherwise, all we care about is price
                } else if (sets[i]['@'].NarrowBy === 'PriceRange') {
                    didGetPriceRange = true;
                    // create a new search with each price range as parameters
                    var p;
                    items = [];
                    ajaxCallsMax = sets[i].Bin.length;
                    for (var j = 0; j < sets[i].Bin.length; j++) {
                        // sets[i].Bin[j]
                        p = sets[i].Bin[j].BinParameter;
                        var options = {
                            SearchIndex: index,
                            Keywords: query,
                            BrowseNode: node,
                            Brand: brand,
                            Availability: 'Available',
                            Sort: validSort[index],
                            ResponseGroup: 'Reviews,SalesRank,Images,OfferSummary,EditorialReview,ItemAttributes'
                        };
                        p = arrayIfNot(p);

                        for (var k = 0; k < p.length; k++) {
                            options[p[k].Name] = p[k].Value;
                        }
                        callWithOptions(options);
                    }
                }
            }

            if (!didGetPriceRange) {
                res.json({
                    results: items,
                    narrowNodes: nodes,
                    raw: result
                });
            }
        }
    );

};