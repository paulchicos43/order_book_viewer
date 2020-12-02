import BookColumn from './components/BookColumn';
import React, { useState, useEffect, useRef } from'react';
import './App.css';





function App() {
  const currencyPair = "BTC-USD";
  const ws = new useRef(null);
  const [bidData, setBidData] = useState([]);
  const [askData, setAskData] = useState([]);
  const [tool, setTool] = useState("");
  let asks = [];
  let bids = [];
  
  /**
   * Open the connection to the web socket
   */
  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com');
    ws.current.onclose = () => {
      console.log("CLOSING");
    }
    return () => { //Close on cleanup
      ws.current.close();
    }
  }, [ws]);

  /**
   * Maintain the bid and ask price lists
   */
  useEffect(() => {
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        type: 'subscribe',
        product_ids: [
            currencyPair,
        ],
        channels: [
            'level2',
        ],
    }));
    }

    ws.current.onmessage = (e) => {
      let parsedMsg = JSON.parse(e.data);

      //Deep copy
      asks = askData.slice();
      bids = bidData.slice();

      if(parsedMsg.type === "snapshot") { //Build initial orderbook
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
    } else if (parsedMsg.type === "l2update") {
        if(parsedMsg.changes[0][0] === "buy") { //Update bid prices
            let bidPriceAffected = Number(parsedMsg.changes[0][1]);
            let newBidQuantity = Number(parsedMsg.changes[0][2]);
            for(let i = 0; i < bids.length; i++) {
                if(bids[i].price === bidPriceAffected && newBidQuantity === 0) { //Eliminate a price

                    bids.splice(i, 1);
                    break;
                } else if (bids[i].price === bidPriceAffected && newBidQuantity !== 0) { //Update a price

                    bids[i].quantity = newBidQuantity;
                    break;
                } else if (bidPriceAffected > bids[i].price && newBidQuantity !== 0) { //Insert a price
                    bids.splice(i, 0, {
                        price: bidPriceAffected,
                        quantity: newBidQuantity,
                    });
                    break;
                }
            }
        } else if (parsedMsg.changes[0][0] === "sell") { //Update ask prices
            let askPriceAffected = Number(parsedMsg.changes[0][1]);
            let newAskQuantity = Number(parsedMsg.changes[0][2]);
            for(let i = 0; i < asks.length; i++) {
                if(asks[i].price === askPriceAffected && newAskQuantity === 0) { //Eliminate a price
                    asks.splice(i, 1);
                    break;
                } else if (asks[i].price === askPriceAffected && newAskQuantity !== 0) { //Update a price
                    asks[i].quantity = newAskQuantity;
                    break;
                } else if (askPriceAffected < asks[i].price && newAskQuantity !== 0) { //Insert a price
                    asks.splice(i, 0, {
                        price: askPriceAffected,
                        quantity: newAskQuantity,
                    });
                    break;
                }
            }
        }
    }
    setBidData(bids);
    setAskData(asks);
    
    setTool("");
    }
  }, [tool,asks,bids,ws]);


  const disp = () => {
    console.log(bidData[0]);
  }
  return (
    <div className="App">
      <BookColumn list = { bidData.slice(0,20) } />
      <BookColumn list = { askData.slice(0,20) } />
    </div>
  );
}

export default App;
