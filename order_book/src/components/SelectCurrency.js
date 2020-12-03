import React, { useState } from 'react';
import '../css/SelectCurrency.css';

/**
 * Component for selecting between given currencies
 * @param {Object} props contain functions for modifying states of super components
 */
export default function SelectCurrency(props) {
    const [selectedETH, setSelectedETH] = useState(true);
    const [selectedBTC, setSelectedBTC] = useState(false);
    const [selectedXRP, setSelectedXRP] = useState(false);

    /**
     * Handles ETH radio button.
     */
    const handleETHClick = () => {
        if(!selectedETH) {
            setSelectedETH(true);
            setSelectedBTC(false);
            setSelectedXRP(false);
            props.setCurrency("ETH-USD");
        }
    }

    /**
     * Handles BTC radio button.
     */
    const handleBTCClick = () => {
        if(!selectedBTC) {
            setSelectedBTC(true);
            setSelectedETH(false);
            setSelectedXRP(false);
            props.setCurrency("BTC-USD");
        }
    }

    /**
     * Handles XRP radio button.
     */
    const handleXRPClick = () => {
        if(!selectedXRP) {
            setSelectedBTC(false);
            setSelectedETH(false);
            setSelectedXRP(true);
            props.setCurrency("XRP-USD");
        }
    }


    return (
        <div className = "RadioText">
            <div className = "RadioButton">
                <input onChange = {() => {}} onClick = { handleETHClick } checked = { selectedETH } type = "radio" id = "ETH-USD" name = "Currency" value = "ETH-USD" />
                <label className = "RadioLabel" htmlFor = "ETH-USD">ETH/USD</label>
            </div>
            <div className = "RadioButton">
                <input onChange = {() => {}} onClick = { handleBTCClick } checked = { selectedBTC } type = "radio" id = "BTC-USD" name = "Currency" value = "BTC-USD" />
                <label htmlFor = "BTC-USD">BTC/USD</label>
            </div>
            <div className = "RadioButton">
                <input onChange = {() => {}} onClick = { handleXRPClick } checked = { selectedXRP } type = "radio" id = "XRP-USD" name = "Currency" value = "XRP-USD" />
                <label htmlFor = "XRP-USD">XRP/USD</label>
            </div>
        </div>
    );
}