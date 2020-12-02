import React from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

/**
 * Contains the chart widget from TradingView
 * @param {Object} props 
 */
export default function App(props) {
    return (
        <>
            <TradingViewWidget theme = { Themes.DARK } symbol = { props.symbol } />
        </>
    );
}

