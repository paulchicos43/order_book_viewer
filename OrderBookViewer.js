const ws = require('ws');
const w = new ws('wss://ws-feed.pro.coinbase.com');



let asks = [];
let bids = [];
const currencyPair = "BTC-USD";

/**
 * Open a connection to Coinbase and get orderbook data
 */
w.on('open', () => {
    w.send(JSON.stringify({
        type: 'subscribe',
        product_ids: [
            currencyPair,
        ],
        channels: [
            'level2',
        ],
    }));
});

/**
 * Parse orderbook data
 */
w.on('message', (e) => {
    const parsedMsg = JSON.parse(e);
    if(parsedMsg.type == "snapshot") { //Build initial orderbook
        for(let ask of parsedMsg.asks) {
            asks[asks.length] = {
                price: Number(ask[0]),
                quantity: Number(ask[1]),
            };
        }

        for(let bid of parsedMsg.bids) {
            bids[bids.length] = {
                price: Number(bid[0]),
                quantity: Number(bid[1]),
            };
        }
    } else if (parsedMsg.type == "l2update") {
        if(parsedMsg.changes[0][0] == "buy") { //Update bid prices
            let bidPriceAffected = Number(parsedMsg.changes[0][1]);
            let newBidQuantity = Number(parsedMsg.changes[0][2]);
            for(let i = 0; i < bids.length; i++) {
                if(bids[i].price == bidPriceAffected && newBidQuantity == 0) { //Eliminate a price

                    bids.splice(i, 1);
                    break;
                } else if (bids[i].price == bidPriceAffected && newBidQuantity != 0) { //Update a price

                    bids[i].quantity = newBidQuantity;
                    break;
                } else if (bidPriceAffected > bids[i].price && newBidQuantity != 0) { //Insert a price
                    bids.splice(i, 0, {
                        price: bidPriceAffected,
                        quantity: newBidQuantity,
                    });
                    break;
                }
            }
        } else if (parsedMsg.changes[0][0] == "sell") { //Update ask prices
            let askPriceAffected = Number(parsedMsg.changes[0][1]);
            let newAskQuantity = Number(parsedMsg.changes[0][2]);
            for(let i = 0; i < asks.length; i++) {
                if(asks[i].price == askPriceAffected && newAskQuantity == 0) { //Eliminate a price
                    asks.splice(i, 1);
                    break;
                } else if (asks[i].price == askPriceAffected && newAskQuantity != 0) { //Update a price
                    asks[i].quantity = newAskQuantity;
                    break;
                } else if (askPriceAffected < asks[i].price && newAskQuantity != 0) { //Insert a price
                    asks.splice(i, 0, {
                        price: askPriceAffected,
                        quantity: newAskQuantity,
                    });
                    break;
                }
            }
        }
    }
});

/**
 * When there is an error
 */
w.on('error', (e) => {
    console.log(e);
});

