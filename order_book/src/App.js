import BookColumn from './components/BookColumn';
import React, { useState, useEffect, useRef } from'react';
import './css/App.css';
import TradingViewWidget from './components/TradingViewWidget';
import SelectCurrency from './components/SelectCurrency';



/**
 * Main app interface
 */
export default function App() {
  const ws = new useRef(null);
  const [bidData, setBidData] = useState([]);
  const [askData, setAskData] = useState([]);
  const [tool, setTool] = useState("");
  let asks = [];
  let bids = [];
  
  const [currencyPair, setCurrencyPair] = useState("ETH-USD");

  /**
   * Sets new currency for the app
   * @param {String} newCurrency is the new currency
   */
  const setCurrency = (newCurrency) => {
    setCurrencyPair(newCurrency);
  }
  /**
   * Open the connection to the web socket
   */
  useEffect(() => {
    ws.current = new WebSocket('wss://ws-feed.pro.coinbase.com');
    ws.current.onclose = () => {
      console.log("CLOSING");
    }
    return () => { //Close on cleanup. Empty arrays for next change.
      ws.current.close();
      asks = [];
      bids = [];
      setBidData([]);
      setAskData([]);
    }
  }, [ws, currencyPair]);

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

    
    /**
     * Parses message data into order book
     * @param {JSON} e is the JSON respose from the websocket. The data we want is located in e.data
     */
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
      
      setTool(""); //Re-render
    }
  }, [tool,asks,bids,ws]);

  return (
    <div className="App">
      <h1 className = "Title">Order Book { currencyPair }</h1>
      <div>
        <SelectCurrency setCurrency = { setCurrency } />
      </div>
      <div className = "LeftColumn">
        <BookColumn title = "Bids" color = 'white' list = { bidData.slice(0,10) } />
      </div>
      <div className = "RightColumn">
        <BookColumn title = "Asks" color = 'white' list = { askData.slice(0,10) } />
      </div>
      <div className = "Chart">
        <TradingViewWidget symbol = {"COINBASE:" + currencyPair.split('-')[0] + currencyPair.split('-')[1]} />
      </div>
    </div>
  );
}
