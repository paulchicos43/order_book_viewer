import React, { useState } from 'react';
import '../css/SelectCurrency.css';

/**
 * Component for selecting between given currencies
 * @param {Object} props contain functions for modifying states of super components
 */
export default function SelectCurrency(props) {
    const [selectedETH, setSelectedETH] = useState(true);
    const [selectedBTC, setSelectedBTC] = useState(false);

    /**
     * Handles ETH radio button. Changes button checks and propogates changes.
     */
    const handleETHClick = () => {
        if(!selectedETH) {
            setSelectedETH(true);
            setSelectedBTC(false);
            props.setCurrency("ETH-USD");
        }
    }

    /**
     * Handles BTC radio button. Changes button checks and propogates changes.
     */
    const handleBTCClick = () => {
        if(!selectedBTC) {
            setSelectedBTC(true);
            setSelectedETH(false);
            props.setCurrency("BTC-USD");
        }
    }


    return (
        <div className = "RadioText">
            <input onChange = {() => {}} onClick = { handleETHClick } checked = { selectedETH } type = "radio" id = "ETH-USD" name = "Currency" value = "ETH-USD" />
            <label className = "RadioLabel" htmlFor = "ETH-USD">ETH/USD</label>
            <input onChange = {() => {}} onClick = { handleBTCClick } checked = { selectedBTC } type = "radio" id = "BTC-USD" name = "Currency" value = "BTC-USD" />
            <label htmlFor = "BTC-USD">BTC/USD</label>
        </div>
    );
}